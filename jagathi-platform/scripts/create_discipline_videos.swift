import Foundation
import AVFoundation
import CoreGraphics
import CoreText
import ImageIO

struct VideoConfig {
    let outputURL: URL
    let width: Int
    let height: Int
    let durationSeconds: Double
    let fps: Int32
    let title: String
    let subtitle: String
    let badge: String
    let imagePaths: [String]
    let sourceVideoPath: String?
}

func loadImage(at path: String, targetSize: CGSize) -> CGImage? {
    let url = URL(fileURLWithPath: path) as CFURL
    guard let constSource = CGImageSourceCreateWithURL(url, nil) else {
        return nil
    }
    return CGImageSourceCreateImageAtIndex(constSource, 0, nil)
}

func renderFrame(
    width: Int,
    height: Int,
    progress: Double,
    config: VideoConfig,
    images: [CGImage],
    sourceVideoFrames: [CGImage]
) -> CVPixelBuffer? {
    var pixelBuffer: CVPixelBuffer?
    let attrs = [
        kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue!,
        kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue!,
        kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA
    ] as CFDictionary
    
    let status = CVPixelBufferCreate(
        kCFAllocatorDefault,
        width,
        height,
        kCVPixelFormatType_32BGRA,
        attrs,
        &pixelBuffer
    )
    
    guard status == kCVReturnSuccess, let buffer = pixelBuffer else {
        return nil
    }
    
    CVPixelBufferLockBaseAddress(buffer, [])
    defer { CVPixelBufferUnlockBaseAddress(buffer, []) }
    
    let pixelData = CVPixelBufferGetBaseAddress(buffer)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    
    guard let context = CGContext(
        data: pixelData,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    ) else {
        return nil
    }
    
    let rect = CGRect(x: 0, y: 0, width: width, height: height)
    
    // Dark background base (#121315)
    context.setFillColor(CGColor(red: 18/255.0, green: 19/255.0, blue: 21/255.0, alpha: 1.0))
    context.fill(rect)
    
    // Calculate sequence slideshow index
    let totalSlides = images.count + (sourceVideoFrames.isEmpty ? 0 : 2)
    let slideProgress = progress * Double(totalSlides)
    let currentSlideIdx = Int(slideProgress) % totalSlides
    let slideAlpha = sin(Double.pi * (slideProgress.truncatingRemainder(dividingBy: 1.0)))
    
    // Render current image slide with smooth pan/zoom
    if currentSlideIdx < images.count {
        let img = images[currentSlideIdx]
        context.saveGState()
        
        let scale = 1.0 + 0.08 * sin(progress * Double.pi * 2 + Double(currentSlideIdx))
        let translateX = (progress - 0.5) * 30.0
        
        let imgWidth = CGFloat(img.width)
        let imgHeight = CGFloat(img.height)
        let aspect = imgWidth / imgHeight
        let canvasAspect = CGFloat(width) / CGFloat(height)
        
        var drawRect: CGRect
        if aspect > canvasAspect {
            let h = CGFloat(height) * scale
            let w = h * aspect
            drawRect = CGRect(x: (CGFloat(width) - w) / 2 + translateX, y: (CGFloat(height) - h) / 2, width: w, height: h)
        } else {
            let w = CGFloat(width) * scale
            let h = w / aspect
            drawRect = CGRect(x: (CGFloat(width) - w) / 2 + translateX, y: (CGFloat(height) - h) / 2, width: w, height: h)
        }
        
        context.setAlpha(CGFloat(max(0.45, slideAlpha)))
        context.draw(img, in: drawRect)
        context.restoreGState()
    } else if !sourceVideoFrames.isEmpty {
        let frameIdx = Int(progress * Double(sourceVideoFrames.count)) % sourceVideoFrames.count
        let img = sourceVideoFrames[frameIdx]
        context.saveGState()
        context.setAlpha(0.85)
        context.draw(img, in: rect)
        context.restoreGState()
    }
    
    // Dark vignetting gradient overlay
    context.saveGState()
    let colors = [
        CGColor(red: 0, green: 0, blue: 0, alpha: 0.75),
        CGColor(red: 0, green: 0, blue: 0, alpha: 0.15),
        CGColor(red: 0, green: 0, blue: 0, alpha: 0.85)
    ] as CFArray
    if let grad = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0.0, 0.5, 1.0]) {
        context.drawRadialGradient(
            grad,
            startCenter: CGPoint(x: width/2, y: height/2),
            startRadius: 50,
            endCenter: CGPoint(x: width/2, y: height/2),
            endRadius: CGFloat(max(width, height) / 2 + 100),
            options: []
        )
    }
    context.restoreGState()
    
    // Subtle architectural grid line pattern
    context.setStrokeColor(CGColor(red: 255/255.0, green: 234/255.0, blue: 10/255.0, alpha: 0.12))
    context.setLineWidth(1.0)
    for x in stride(from: 0, to: width, by: 120) {
        context.move(to: CGPoint(x: CGFloat(x), y: 0))
        context.addLine(to: CGPoint(x: CGFloat(x), y: CGFloat(height)))
    }
    for y in stride(from: 0, to: height, by: 120) {
        context.move(to: CGPoint(x: 0, y: CGFloat(y)))
        context.addLine(to: CGPoint(x: CGFloat(width), y: CGFloat(y)))
    }
    context.strokePath()
    
    // Animated sweeping radar scanline
    let scanY = CGFloat(progress) * CGFloat(height)
    context.setStrokeColor(CGColor(red: 255/255.0, green: 234/255.0, blue: 10/255.0, alpha: 0.45))
    context.setLineWidth(1.5)
    context.move(to: CGPoint(x: 0, y: scanY))
    context.addLine(to: CGPoint(x: CGFloat(width), y: scanY))
    context.strokePath()
    
    // HUD Tech Badge (Top Left)
    let badgeText = config.badge as NSString
    let badgeFont = CTFontCreateWithName("HelveticaNeue-Bold" as CFString, 22, nil)
    let badgeAttr: [CFString: Any] = [
        kCTFontAttributeName: badgeFont,
        kCTForegroundColorAttributeName: CGColor(red: 255/255.0, green: 234/255.0, blue: 10/255.0, alpha: 1.0)
    ]
    let badgeLine = CTLineCreateWithAttributedString(CFAttributedStringCreate(nil, badgeText, badgeAttr as CFDictionary))
    context.textPosition = CGPoint(x: 50, y: CGFloat(height) - 70)
    CTLineDraw(badgeLine, context)
    
    // Title Overlay (Bottom Left)
    let titleText = config.title as NSString
    let titleFont = CTFontCreateWithName("HelveticaNeue-CondensedBold" as CFString, 38, nil)
    let titleAttr: [CFString: Any] = [
        kCTFontAttributeName: titleFont,
        kCTForegroundColorAttributeName: CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.95)
    ]
    let titleLine = CTLineCreateWithAttributedString(CFAttributedStringCreate(nil, titleText, titleAttr as CFDictionary))
    context.textPosition = CGPoint(x: 50, y: 110)
    CTLineDraw(titleLine, context)
    
    // Subtitle Overlay (Bottom Left below title)
    let subText = config.subtitle as NSString
    let subFont = CTFontCreateWithName("HelveticaNeue" as CFString, 18, nil)
    let subAttr: [CFString: Any] = [
        kCTFontAttributeName: subFont,
        kCTForegroundColorAttributeName: CGColor(red: 255/255.0, green: 234/255.0, blue: 10/255.0, alpha: 0.85)
    ]
    let subLine = CTLineCreateWithAttributedString(CFAttributedStringCreate(nil, subText, subAttr as CFDictionary))
    context.textPosition = CGPoint(x: 50, y: 70)
    CTLineDraw(subLine, context)
    
    return buffer
}

func extractVideoFrames(videoPath: String, maxFrames: Int) -> [CGImage] {
    let url = URL(fileURLWithPath: videoPath)
    let asset = AVURLAsset(url: url)
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    
    var frames: [CGImage] = []
    let duration = CMTimeGetSeconds(asset.duration)
    guard duration > 0 else { return [] }
    
    let step = duration / Double(maxFrames)
    for i in 0..<maxFrames {
        let time = CMTime(seconds: Double(i) * step, preferredTimescale: 600)
        if let cgImg = try? generator.copyCGImage(at: time, actualTime: nil) {
            frames.append(cgImg)
        }
    }
    return frames
}

func generateVideo(config: VideoConfig) {
    try? FileManager.default.removeItem(at: config.outputURL)
    
    guard let writer = try? AVAssetWriter(outputURL: config.outputURL, fileType: .mp4) else {
        print("Failed to create AVAssetWriter for \(config.outputURL.lastPathComponent)")
        return
    }
    
    let videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: config.width,
        AVVideoHeightKey: config.height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 6_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
        ]
    ]
    
    let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
        assetWriterInput: writerInput,
        sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
            kCVPixelBufferWidthKey as String: config.width,
            kCVPixelBufferHeightKey as String: config.height
        ]
    )
    
    writer.add(writerInput)
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    
    let loadedImages = config.imagePaths.compactMap { loadImage(at: $0, targetSize: CGSize(width: config.width, height: config.height)) }
    let videoFrames = config.sourceVideoPath != nil ? extractVideoFrames(videoPath: config.sourceVideoPath!, maxFrames: 40) : []
    
    let totalFrames = Int(config.durationSeconds * Double(config.fps))
    let frameDuration = CMTime(value: 1, timescale: config.fps)
    
    let queue = DispatchQueue(label: "video_generation_queue")
    let semaphore = DispatchSemaphore(value: 0)
    
    var currentFrame = 0
    writerInput.requestMediaDataWhenReady(on: queue) {
        while writerInput.isReadyForMoreMediaData {
            if currentFrame >= totalFrames {
                writerInput.markAsFinished()
                writer.finishWriting {
                    print("Successfully generated video: \(config.outputURL.lastPathComponent)")
                    semaphore.signal()
                }
                break
            }
            
            let progress = Double(currentFrame) / Double(totalFrames)
            let presentTime = CMTimeMultiply(frameDuration, multiplier: Int32(currentFrame))
            
            if let pxBuffer = renderFrame(
                width: config.width,
                height: config.height,
                progress: progress,
                config: config,
                images: loadedImages,
                sourceVideoFrames: videoFrames
            ) {
                adaptor.append(pxBuffer, withPresentationTime: presentTime)
            }
            
            currentFrame += 1
        }
    }
    
    semaphore.wait()
}

// MAIN EXECUTION
let baseDir = "/Volumes/Nikhil Drive/Nikhil/Codes/Websites/Pragathi/jagathi-platform"
let pubVid = "\(baseDir)/public/assets/videos"

let configs: [VideoConfig] = [
    VideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/construction_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 6.0,
        fps: 30,
        title: "CONSTRUCTION & LAND DEVELOPMENT",
        subtitle: "M50 Concrete Cores · Heavy Structural Steel Lattices",
        badge: "// DISCIPLINE 01",
        imagePaths: [
            "\(baseDir)/public/assets/images/sketches/sketch_blueprint_1.webp",
            "\(baseDir)/public/assets/images/white_renders/white_render_building_1.webp",
            "\(baseDir)/public/assets/images/sketches/sketch_arch_facade_1.webp",
            "\(baseDir)/public/assets/images/completed/completed_project_1.webp"
        ],
        sourceVideoPath: "\(pubVid)/construction_walkthrough.mp4"
    ),
    VideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/interiors_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 6.0,
        fps: 30,
        title: "ARCHITECTURAL INTERIOR SOLUTIONS",
        subtitle: "Hand-Drawn Loft Drawings · Calacatta Marble & Hardwoods",
        badge: "// DISCIPLINE 02",
        imagePaths: [
            "\(baseDir)/public/assets/images/sketches/sketch_interior_loft.webp",
            "\(baseDir)/public/assets/images/sketches/sketch_wireframe_draft_1.webp",
            "\(baseDir)/public/assets/images/white_renders/white_render_spatial_1.webp",
            "\(baseDir)/public/assets/images/completed/completed_interior_1.webp"
        ],
        sourceVideoPath: "\(pubVid)/interior_walkthrough.mp4"
    ),
    VideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/civil_market_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 6.0,
        fps: 30,
        title: "PROPERTY ADVISORY SERVICES",
        subtitle: "Corridor Mapping · Plotted Smart-Zones & Zoning Clearances",
        badge: "// DISCIPLINE 03",
        imagePaths: [
            "\(baseDir)/public/assets/images/sketches/sketch_blueprint_3.webp",
            "\(baseDir)/public/assets/images/sketches/sketch_blueprint_4.webp",
            "\(baseDir)/public/assets/images/sketches/sketch_blueprint_6.webp",
            "\(baseDir)/public/assets/images/completed/completed_project_4.webp"
        ],
        sourceVideoPath: nil
    )
]

for cfg in configs {
    print("Generating video for \(cfg.title)...")
    generateVideo(config: cfg)
}
