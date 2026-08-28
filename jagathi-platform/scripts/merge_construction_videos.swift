import Foundation
import AVFoundation
import CoreGraphics
import CoreMedia

let baseDir = "/Volumes/Nikhil Drive/Nikhil/Codes/Websites/Pragathi/jagathi-platform"
let constrDir = "\(baseDir)/public/assets/videos/Construction"
let pubVid = "\(baseDir)/public/assets/videos"

let path1 = "\(constrDir)/Photorealistic_K_architectura.mp4"
let path2 = "\(constrDir)/Firefly yper-detailed 3D architectural scale model of a modern luxury building, pure white studio ba.mp4"

let url1 = URL(fileURLWithPath: path1)
let url2 = URL(fileURLWithPath: path2)

let asset1 = AVURLAsset(url: url1)
let asset2 = AVURLAsset(url: url2)

print("Loading video track durations...")
let dur1 = CMTimeGetSeconds(asset1.duration)
let dur2 = CMTimeGetSeconds(asset2.duration)
print("Clip 1 duration: \(dur1)s, Clip 2 duration: \(dur2)s")

let generator1 = AVAssetImageGenerator(asset: asset1)
generator1.appliesPreferredTrackTransform = true
generator1.requestedTimeToleranceBefore = .zero
generator1.requestedTimeToleranceAfter = .zero

let generator2 = AVAssetImageGenerator(asset: asset2)
generator2.appliesPreferredTrackTransform = true
generator2.requestedTimeToleranceBefore = .zero
generator2.requestedTimeToleranceAfter = .zero

let targetWidth = 1920
let targetHeight = 1080
let fps: Int32 = 60
let transitionDuration: Double = 1.5

// Target combined video duration = dur1 + dur2 - transitionDuration (approx 16-18s)
let totalDurationSeconds = max(15.0, dur1 + dur2 - transitionDuration)
let totalFrames = Int(totalDurationSeconds * Double(fps))

func extractFrame(from generator: AVAssetImageGenerator, at timeSeconds: Double) -> CGImage? {
    let cmTime = CMTime(seconds: timeSeconds, preferredTimescale: 600)
    return try? generator.copyCGImage(at: cmTime, actualTime: nil)
}

func renderMergedFrame(
    width: Int,
    height: Int,
    progress: Double,
    totalSeconds: Double,
    dur1: Double,
    dur2: Double,
    gen1: AVAssetImageGenerator,
    gen2: AVAssetImageGenerator
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
    let crossfadeStart = dur1 - transitionDuration
    
    var img1: CGImage?
    var img2: CGImage?
    var alpha1: CGFloat = 1.0
    var alpha2: CGFloat = 0.0
    
    if currentSeconds < crossfadeStart {
        // Clip 1 strictly
        img1 = extractFrame(from: gen1, at: currentSeconds)
        alpha1 = 1.0
        alpha2 = 0.0
    } else if currentSeconds <= dur1 {
        // Crossfade region
        let crossProgress = (currentSeconds - crossfadeStart) / transitionDuration
        img1 = extractFrame(from: gen1, at: min(currentSeconds, dur1 - 0.05))
        img2 = extractFrame(from: gen2, at: (currentSeconds - crossfadeStart))
        alpha1 = CGFloat(1.0 - crossProgress)
        alpha2 = CGFloat(crossProgress)
    } else {
        // Clip 2 strictly
        let clip2Time = min(dur2 - 0.05, (currentSeconds - dur1) + transitionDuration)
        img2 = extractFrame(from: gen2, at: max(0.0, clip2Time))
        alpha1 = 0.0
        alpha2 = 1.0
    }
    
    func drawHighClarityImage(_ img: CGImage, alpha: CGFloat) {
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
    
    if let i1 = img1, alpha1 > 0 {
        drawHighClarityImage(i1, alpha: alpha1)
    }
    if let i2 = img2, alpha2 > 0 {
        drawHighClarityImage(i2, alpha: alpha2)
    }
    
    // Subtle High-Clarity Studio Vignette (Pure White Edge Polish)
    context.saveGState()
    let whiteColors = [
        CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.0),
        CGColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.25)
    ] as CFArray
    if let grad = CGGradient(colorsSpace: colorSpace, colors: whiteColors, locations: [0.8, 1.0]) {
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

func exportMergedHighResVideo(outputURL: URL) {
    try? FileManager.default.removeItem(at: outputURL)
    
    guard let writer = try? AVAssetWriter(outputURL: outputURL, fileType: .mp4) else {
        print("Failed to create AVAssetWriter for \(outputURL.lastPathComponent)")
        return
    }
    
    // High-Clarity 1080p 60fps Bitrate Config (14 Mbps High Quality H.264)
    let videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: targetWidth,
        AVVideoHeightKey: targetHeight,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 14_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoExpectedSourceFrameRateKey: 60,
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
    let queue = DispatchQueue(label: "video_merge_queue")
    let semaphore = DispatchSemaphore(value: 0)
    
    var currentFrame = 0
    writerInput.requestMediaDataWhenReady(on: queue) {
        while writerInput.isReadyForMoreMediaData {
            if currentFrame >= totalFrames {
                writerInput.markAsFinished()
                writer.finishWriting {
                    print("Successfully exported merged 1080p 60fps video: \(outputURL.lastPathComponent)")
                    semaphore.signal()
                }
                break
            }
            
            let progress = Double(currentFrame) / Double(totalFrames)
            let presentTime = CMTimeMultiply(frameDuration, multiplier: Int32(currentFrame))
            
            if let pxBuffer = renderMergedFrame(
                width: targetWidth,
                height: targetHeight,
                progress: progress,
                totalSeconds: totalDurationSeconds,
                dur1: dur1,
                dur2: dur2,
                gen1: generator1,
                gen2: generator2
            ) {
                adaptor.append(pxBuffer, withPresentationTime: presentTime)
            }
            
            currentFrame += 1
        }
    }
    
    semaphore.wait()
}

// Generate for both construction_loop.mp4 and construction_walkthrough.mp4
print("Rendering 18-second merged 1080p 60fps Construction Video...")
let loopURL = URL(fileURLWithPath: "\(pubVid)/construction_loop.mp4")
let walkthroughURL = URL(fileURLWithPath: "\(pubVid)/construction_walkthrough.mp4")

exportMergedHighResVideo(outputURL: loopURL)
try? FileManager.default.removeItem(at: walkthroughURL)
try? FileManager.default.copyItem(at: loopURL, to: walkthroughURL)
print("Copied merged high-clarity video to construction_walkthrough.mp4")
