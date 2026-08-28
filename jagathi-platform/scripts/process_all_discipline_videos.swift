import Foundation
import AVFoundation
import CoreGraphics
import CoreMedia
import ImageIO

let baseDir = "/Volumes/Nikhil Drive/Nikhil/Codes/Websites/Pragathi/jagathi-platform"
let pubVid = "\(baseDir)/public/assets/videos"
let constrDir = "\(pubVid)/Construction"
let interiorDir = "\(pubVid)/Intirior"
let civilDir = "\(pubVid)/Civil"
let logoPath = "\(baseDir)/public/assets/brand/5_original.png"

func loadLogoImage(at path: String) -> CGImage? {
    let url = URL(fileURLWithPath: path) as CFURL
    guard let constSource = CGImageSourceCreateWithURL(url, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(constSource, 0, nil)
}

let logoCGImage = loadLogoImage(at: logoPath)
print("Watermark image (5_original.png) loaded: \(logoCGImage != nil ? "YES" : "NO")")

let targetWidth = 1920
let targetHeight = 1080
let fps: Int32 = 60
let transitionDuration: Double = 1.5

func extractFrame(from generator: AVAssetImageGenerator, at timeSeconds: Double) -> CGImage? {
    let cmTime = CMTime(seconds: timeSeconds, preferredTimescale: 600)
    return try? generator.copyCGImage(at: cmTime, actualTime: nil)
}

func renderWatermarkedFrame(
    width: Int,
    height: Int,
    progress: Double,
    totalSeconds: Double,
    dur1: Double,
    dur2: Double,
    gen1: AVAssetImageGenerator,
    gen2: AVAssetImageGenerator?,
    logo: CGImage?
) -> CVPixelBuffer? {
    var pixelBuffer: CVPixelBuffer?
    let attrs = [
        kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue!,
        kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue!,
        kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA
    ] as CFDictionary
    
    let status = CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32BGRA, attrs, &pixelBuffer)
    guard status == kCVReturnSuccess, let buffer = pixelBuffer else { return nil }
    
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
    ) else { return nil }
    
    let rect = CGRect(x: 0, y: 0, width: width, height: height)
    context.setFillColor(CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0))
    context.fill(rect)
    
    let currentSeconds = progress * totalSeconds
    
    func drawImageScaled(_ img: CGImage, alpha: CGFloat) {
        context.saveGState()
        context.setAlpha(alpha)
        
        let imgW = CGFloat(img.width)
        let imgH = CGFloat(img.height)
        let aspect = imgW / imgH
        let canvasAspect = CGFloat(width) / CGFloat(height)
        
        var drawRect: CGRect
        if aspect > canvasAspect {
            let h = CGFloat(height)
            let w = h * aspect
            drawRect = CGRect(x: (CGFloat(width) - w) / 2, y: 0, width: w, height: h)
        } else {
            let w = CGFloat(width)
            let h = w / aspect
            drawRect = CGRect(x: 0, y: (CGFloat(height) - h) / 2, width: w, height: h)
        }
        
        context.draw(img, in: drawRect)
        context.restoreGState()
    }
    
    if let g2 = gen2 {
        // Dual-clip crossfade merge
        let crossfadeStart = dur1 - transitionDuration
        if currentSeconds < crossfadeStart {
            if let i1 = extractFrame(from: gen1, at: currentSeconds) {
                drawImageScaled(i1, alpha: 1.0)
            }
        } else if currentSeconds <= dur1 {
            let crossProgress = (currentSeconds - crossfadeStart) / transitionDuration
            let i1 = extractFrame(from: gen1, at: min(currentSeconds, dur1 - 0.05))
            let i2 = extractFrame(from: g2, at: (currentSeconds - crossfadeStart))
            if let img1 = i1 { drawImageScaled(img1, alpha: CGFloat(1.0 - crossProgress)) }
            if let img2 = i2 { drawImageScaled(img2, alpha: CGFloat(crossProgress)) }
        } else {
            let clip2Time = min(dur2 - 0.05, (currentSeconds - dur1) + transitionDuration)
            if let i2 = extractFrame(from: g2, at: max(0.0, clip2Time)) {
                drawImageScaled(i2, alpha: 1.0)
            }
        }
    } else {
        // Single clip render
        let t = min(dur1 - 0.05, currentSeconds.truncatingRemainder(dividingBy: dur1))
        if let i1 = extractFrame(from: gen1, at: t) {
            drawImageScaled(i1, alpha: 1.0)
        }
    }
    
    // Draw Watermark Image (5_original.png) in Bottom-Right Corner
    if let logoImg = logo {
        context.saveGState()
        context.setAlpha(0.85) // Crisp luxury watermark
        let logoW: CGFloat = 170.0
        let logoAspect = CGFloat(logoImg.height) / CGFloat(logoImg.width)
        let logoH: CGFloat = logoW * logoAspect
        
        // Position at bottom right with padding
        let logoRect = CGRect(x: CGFloat(width) - logoW - 45.0, y: 45.0, width: logoW, height: logoH)
        
        // Jagathi Brand Yellow (#FFEA0A) Badge Backing
        context.setFillColor(CGColor(red: 255.0/255.0, green: 234.0/255.0, blue: 10.0/255.0, alpha: 0.96))
        let pillRect = logoRect.insetBy(dx: -16, dy: -10)
        let path = CGPath(roundedRect: pillRect, cornerWidth: 8, cornerHeight: 8, transform: nil)
        context.addPath(path)
        context.fillPath()
        
        context.draw(logoImg, in: logoRect)
        context.restoreGState()
    }
    
    return buffer
}

func processDisciplineVideos(
    clip1Path: String,
    clip2Path: String?,
    outputURL: URL,
    logo: CGImage?
) {
    try? FileManager.default.removeItem(at: outputURL)
    
    let asset1 = AVURLAsset(url: URL(fileURLWithPath: clip1Path))
    let dur1 = CMTimeGetSeconds(asset1.duration)
    
    let generator1 = AVAssetImageGenerator(asset: asset1)
    generator1.appliesPreferredTrackTransform = true
    generator1.requestedTimeToleranceBefore = .zero
    generator1.requestedTimeToleranceAfter = .zero
    
    var generator2: AVAssetImageGenerator? = nil
    var dur2: Double = 0.0
    
    if let c2Path = clip2Path, FileManager.default.fileExists(atPath: c2Path) {
        let asset2 = AVURLAsset(url: URL(fileURLWithPath: c2Path))
        dur2 = CMTimeGetSeconds(asset2.duration)
        let gen2 = AVAssetImageGenerator(asset: asset2)
        gen2.appliesPreferredTrackTransform = true
        gen2.requestedTimeToleranceBefore = .zero
        gen2.requestedTimeToleranceAfter = .zero
        generator2 = gen2
    }
    
    let totalSeconds = generator2 != nil ? max(15.0, dur1 + dur2 - transitionDuration) : dur1
    let totalFrames = Int(totalSeconds * Double(fps))
    
    guard let writer = try? AVAssetWriter(outputURL: outputURL, fileType: .mp4) else {
        print("Failed to create AVAssetWriter for \(outputURL.lastPathComponent)")
        return
    }
    
    let videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: targetWidth,
        AVVideoHeightKey: targetHeight,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 14_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoExpectedSourceFrameRateKey: fps,
            AVVideoMaxKeyFrameIntervalKey: 30
        ]
    ]
    
    let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
        assetWriterInput: writerInput,
        sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
            kCVPixelBufferWidthKey as String: targetWidth,
            kCVPixelBufferHeightKey as String: targetHeight
        ]
    )
    
    writer.add(writerInput)
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    
    let frameDuration = CMTime(value: 1, timescale: fps)
    let queue = DispatchQueue(label: "discipline_video_queue")
    let semaphore = DispatchSemaphore(value: 0)
    
    var currentFrame = 0
    writerInput.requestMediaDataWhenReady(on: queue) {
        while writerInput.isReadyForMoreMediaData {
            if currentFrame >= totalFrames {
                writerInput.markAsFinished()
                writer.finishWriting {
                    print("Successfully exported 1080p 60fps video with 5_original.png watermark: \(outputURL.lastPathComponent)")
                    semaphore.signal()
                }
                break
            }
            
            let progress = Double(currentFrame) / Double(totalFrames)
            let presentTime = CMTimeMultiply(frameDuration, multiplier: Int32(currentFrame))
            
            if let pxBuffer = renderWatermarkedFrame(
                width: targetWidth,
                height: targetHeight,
                progress: progress,
                totalSeconds: totalSeconds,
                dur1: dur1,
                dur2: dur2,
                gen1: generator1,
                gen2: generator2,
                logo: logo
            ) {
                adaptor.append(pxBuffer, withPresentationTime: presentTime)
            }
            
            currentFrame += 1
        }
    }
    
    semaphore.wait()
}

// EXECUTION
print("=== Processing Construction Videos ===")
let constrClip1 = "\(constrDir)/Photorealistic_K_architectura.mp4"
let constrClip2 = "\(constrDir)/Firefly yper-detailed 3D architectural scale model of a modern luxury building, pure white studio ba.mp4"
let constrLoopURL = URL(fileURLWithPath: "\(pubVid)/construction_loop.mp4")
processDisciplineVideos(clip1Path: constrClip1, clip2Path: constrClip2, outputURL: constrLoopURL, logo: logoCGImage)
let constrWalkthroughURL = URL(fileURLWithPath: "\(pubVid)/construction_walkthrough.mp4")
try? FileManager.default.removeItem(at: constrWalkthroughURL)
try? FileManager.default.copyItem(at: constrLoopURL, to: constrWalkthroughURL)

print("\n=== Processing Interior Videos ===")
let intClip1 = "\(interiorDir)/Cinematic_K_luxury_interior_a.mp4"
let intClip2 = "\(interiorDir)/Firefly -imagine prompt- Ultra-high-end 3D white architectural interior, double height atrium with f.mp4"
let intLoopURL = URL(fileURLWithPath: "\(pubVid)/interiors_loop.mp4")
processDisciplineVideos(clip1Path: intClip1, clip2Path: intClip2, outputURL: intLoopURL, logo: logoCGImage)
let intWalkthroughURL = URL(fileURLWithPath: "\(pubVid)/interior_walkthrough.mp4")
try? FileManager.default.removeItem(at: intWalkthroughURL)
try? FileManager.default.copyItem(at: intLoopURL, to: intWalkthroughURL)

print("\n=== Processing Civil Market Videos ===")
let civilClip1 = "\(civilDir)/Aerial_D_architectural_master.mp4"
let civilClip2 = "\(civilDir)/Architectural_D_masterplan_ci.mp4"
let civilLoopURL = URL(fileURLWithPath: "\(pubVid)/civil_market_loop.mp4")
processDisciplineVideos(clip1Path: civilClip1, clip2Path: civilClip2, outputURL: civilLoopURL, logo: logoCGImage)

print("\n✅ All 3 discipline videos merged & watermarked with 5_original.png successfully!")
