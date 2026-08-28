import Foundation
import AVFoundation
import CoreGraphics
import ImageIO

struct WhiteVideoConfig {
    let outputURL: URL
    let width: Int
    let height: Int
    let durationSeconds: Double
    let fps: Int32
    let sketchImages: [String]
    let whiteRenders: [String]
}

func loadImage(at path: String) -> CGImage? {
    let url = URL(fileURLWithPath: path) as CFURL
    guard let constSource = CGImageSourceCreateWithURL(url, nil) else {
        return nil
    }
    return CGImageSourceCreateImageAtIndex(constSource, 0, nil)
}

func renderRealistic3DOrbitFrame(
    width: Int,
    height: Int,
    progress: Double,
    config: WhiteVideoConfig,
    sketches: [CGImage],
    renders: [CGImage]
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
    
    // Pure Architectural Studio White Background (#FFFFFF)
    context.setFillColor(CGColor(red: 255/255.0, green: 255/255.0, blue: 255/255.0, alpha: 1.0))
    context.fill(rect)
    
    // Smooth 3D Orbit Camera math (Smooth Sine Ease-In-Out across the 10s loop)
    let orbitPhase = progress * Double.pi * 2.0
    let cameraZoom = 1.0 + 0.06 * cos(orbitPhase)
    let cameraOrbitX = sin(orbitPhase) * 22.0
    let cameraOrbitY = cos(orbitPhase) * 12.0
    
    // Morph & sequence between Angle 1 and Angle 2
    let renderCount = max(1, renders.count)
    let renderProgress = progress * Double(renderCount)
    let renderIdx1 = Int(renderProgress) % renderCount
    let renderIdx2 = (renderIdx1 + 1) % renderCount
    let blendAlpha = renderProgress.truncatingRemainder(dividingBy: 1.0)
    
    let img1 = renders[renderIdx1]
    let img2 = renders[renderIdx2]
    
    func calculateDrawRect(for img: CGImage) -> CGRect {
        let imgW = CGFloat(img.width)
        let imgH = CGFloat(img.height)
        let aspect = imgW / imgH
        let canvasAspect = CGFloat(width) / CGFloat(height)
        
        if aspect > canvasAspect {
            let h = (CGFloat(height) * 0.88) * cameraZoom
            let w = h * aspect
            return CGRect(x: (CGFloat(width) - w) / 2 + cameraOrbitX, y: (CGFloat(height) - h) / 2 + cameraOrbitY, width: w, height: h)
        } else {
            let w = (CGFloat(width) * 0.88) * cameraZoom
            let h = w / aspect
            return CGRect(x: (CGFloat(width) - w) / 2 + cameraOrbitX, y: (CGFloat(height) - h) / 2 + cameraOrbitY, width: w, height: h)
        }
    }
    
    let drawRect1 = calculateDrawRect(for: img1)
    let drawRect2 = calculateDrawRect(for: img2)
    
    // Soft studio shadow beneath structure
    context.saveGState()
    let shadowEllipse = drawRect1.insetBy(dx: drawRect1.width * 0.1, dy: drawRect1.height * 0.42).offsetBy(dx: 0, dy: drawRect1.height * 0.38)
    context.setFillColor(CGColor(red: 0, green: 0, blue: 0, alpha: 0.05))
    let shadowPath = CGPath(ellipseIn: shadowEllipse, transform: nil)
    context.addPath(shadowPath)
    context.fillPath()
    context.restoreGState()
    
    // Render 3D Angle 1
    context.saveGState()
    context.setAlpha(CGFloat(1.0 - blendAlpha * 0.85))
    context.draw(img1, in: drawRect1)
    context.restoreGState()
    
    // Blend 3D Angle 2 to create true rotational depth morphing
    context.saveGState()
    context.setAlpha(CGFloat(blendAlpha * 0.85))
    context.draw(img2, in: drawRect2)
    context.restoreGState()
    
    // Soft white studio perimeter vignette
    context.saveGState()
    let studioVignette = [
        CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.0),
        CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.3)
    ] as CFArray
    if let grad = CGGradient(colorsSpace: colorSpace, colors: studioVignette, locations: [0.75, 1.0]) {
        context.drawRadialGradient(
            grad,
            startCenter: CGPoint(x: width/2, y: height/2),
            startRadius: CGFloat(min(width, height) / 3),
            endCenter: CGPoint(x: width/2, y: height/2),
            endRadius: CGFloat(max(width, height) / 2),
            options: []
        )
    }
    context.restoreGState()
    
    return buffer
}

func generatePureWhiteVideo(config: WhiteVideoConfig) {
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
            AVVideoAverageBitRateKey: 9_000_000,
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
    
    let sketches = config.sketchImages.compactMap { loadImage(at: $0) }
    let renders = config.whiteRenders.compactMap { loadImage(at: $0) }
    
    let totalFrames = Int(config.durationSeconds * Double(config.fps))
    let frameDuration = CMTime(value: 1, timescale: config.fps)
    
    let queue = DispatchQueue(label: "pure_white_video_queue")
    let semaphore = DispatchSemaphore(value: 0)
    
    var currentFrame = 0
    writerInput.requestMediaDataWhenReady(on: queue) {
        while writerInput.isReadyForMoreMediaData {
            if currentFrame >= totalFrames {
                writerInput.markAsFinished()
                writer.finishWriting {
                    print("Successfully generated 3D orbit video: \(config.outputURL.lastPathComponent)")
                    semaphore.signal()
                }
                break
            }
            
            let progress = Double(currentFrame) / Double(totalFrames)
            let presentTime = CMTimeMultiply(frameDuration, multiplier: Int32(currentFrame))
            
            if let pxBuffer = renderRealistic3DOrbitFrame(
                width: config.width,
                height: config.height,
                progress: progress,
                config: config,
                sketches: sketches,
                renders: renders
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
let pubImg = "\(baseDir)/public/assets/images/white_renders"

let configs: [WhiteVideoConfig] = [
    WhiteVideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/construction_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 10.0,
        fps: 30,
        sketchImages: [],
        whiteRenders: [
            "\(pubImg)/construction_3d_angle1.webp",
            "\(pubImg)/construction_3d_angle2.webp"
        ]
    ),
    WhiteVideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/interiors_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 10.0,
        fps: 30,
        sketchImages: [],
        whiteRenders: [
            "\(pubImg)/interior_3d_angle1.webp",
            "\(pubImg)/interior_3d_angle2.webp"
        ]
    ),
    WhiteVideoConfig(
        outputURL: URL(fileURLWithPath: "\(pubVid)/civil_market_loop.mp4"),
        width: 1280,
        height: 720,
        durationSeconds: 10.0,
        fps: 30,
        sketchImages: [],
        whiteRenders: [
            "\(pubImg)/civil_3d_angle1.webp",
            "\(pubImg)/civil_3d_angle2.webp"
        ]
    )
]

for cfg in configs {
    print("Generating 3D orbit video for \(cfg.outputURL.lastPathComponent)...")
    generatePureWhiteVideo(config: cfg)
}
