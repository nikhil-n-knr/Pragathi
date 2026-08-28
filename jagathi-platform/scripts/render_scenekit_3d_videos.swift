import Foundation
import AVFoundation
import CoreGraphics
import SceneKit
import AppKit

struct SceneKitVideoConfig {
    let outputURL: URL
    let width: Int
    let height: Int
    let durationSeconds: Double
    let fps: Int32
    let type: String // "construction", "interior", "civil"
}

func createConstruction3DScene() -> (SCNScene, SCNNode) {
    let scene = SCNScene()
    scene.background.contents = NSColor.white
    
    let rootNode = scene.rootNode
    let buildingContainer = SCNNode()
    rootNode.addChildNode(buildingContainer)
    
    let whiteMaterial = SCNMaterial()
    whiteMaterial.diffuse.contents = NSColor(white: 0.95, alpha: 1.0)
    whiteMaterial.roughness.contents = 0.4
    
    let glassMaterial = SCNMaterial()
    glassMaterial.diffuse.contents = NSColor(white: 0.9, alpha: 0.3)
    glassMaterial.transparency = 0.5
    glassMaterial.reflective.contents = NSColor.white
    
    // Base Plinth
    let baseGeo = SCNBox(width: 8.0, height: 0.4, length: 8.0, chamferRadius: 0.05)
    baseGeo.materials = [whiteMaterial]
    let baseNode = SCNNode(geometry: baseGeo)
    baseNode.position = SCNVector3(0, -0.2, 0)
    buildingContainer.addChildNode(baseNode)
    
    // Stacked modular blocks (Complex 3D building)
    let blockConfigs: [(Float, Float, Float, Float, Float, Float)] = [
        (0, 1.2, 0, 3.2, 2.4, 3.2),
        (-0.8, 3.2, 0.4, 2.6, 1.8, 2.6),
        (0.6, 4.8, -0.4, 2.2, 1.8, 2.2),
        (0, 6.2, 0, 1.6, 1.4, 1.6),
        (1.2, 2.2, 0.8, 1.8, 1.2, 1.8),
        (-1.2, 4.0, -0.8, 1.8, 1.2, 1.8)
    ]
    
    for (x, y, z, w, h, l) in blockConfigs {
        let box = SCNBox(width: CGFloat(w), height: CGFloat(h), length: CGFloat(l), chamferRadius: 0.02)
        box.materials = [whiteMaterial]
        let node = SCNNode(geometry: box)
        node.position = SCNVector3(x, y, z)
        buildingContainer.addChildNode(node)
    }
    
    // Glass balcony facade panels
    let glassBox = SCNBox(width: 3.4, height: 2.2, length: 0.08, chamferRadius: 0)
    glassBox.materials = [glassMaterial]
    let glassNode = SCNNode(geometry: glassBox)
    glassNode.position = SCNVector3(0, 2.2, 1.65)
    buildingContainer.addChildNode(glassNode)
    
    // Studio Lighting
    let ambientLight = SCNLight()
    ambientLight.type = .ambient
    ambientLight.color = NSColor(white: 0.7, alpha: 1.0)
    let ambientNode = SCNNode()
    ambientNode.light = ambientLight
    rootNode.addChildNode(ambientNode)
    
    let mainLight = SCNLight()
    mainLight.type = .directional
    mainLight.color = NSColor(white: 0.85, alpha: 1.0)
    mainLight.castsShadow = true
    mainLight.shadowRadius = 8.0
    mainLight.shadowColor = NSColor(white: 0.0, alpha: 0.15)
    let mainLightNode = SCNNode()
    mainLightNode.light = mainLight
    mainLightNode.eulerAngles = SCNVector3(-Float.pi / 3, Float.pi / 4, 0)
    rootNode.addChildNode(mainLightNode)
    
    return (scene, buildingContainer)
}

func createInterior3DScene() -> (SCNScene, SCNNode) {
    let scene = SCNScene()
    scene.background.contents = NSColor.white
    
    let rootNode = scene.rootNode
    let interiorContainer = SCNNode()
    rootNode.addChildNode(interiorContainer)
    
    let whiteMat = SCNMaterial()
    whiteMat.diffuse.contents = NSColor(white: 0.96, alpha: 1.0)
    
    let sofaMat = SCNMaterial()
    sofaMat.diffuse.contents = NSColor(white: 0.90, alpha: 1.0)
    
    // Floor
    let floorGeo = SCNBox(width: 10.0, height: 0.2, length: 10.0, chamferRadius: 0)
    floorGeo.materials = [whiteMat]
    let floorNode = SCNNode(geometry: floorGeo)
    floorNode.position = SCNVector3(0, -0.1, 0)
    interiorContainer.addChildNode(floorNode)
    
    // Double height back wall
    let wallGeo = SCNBox(width: 10.0, height: 6.0, length: 0.2, chamferRadius: 0)
    wallGeo.materials = [whiteMat]
    let wallNode = SCNNode(geometry: wallGeo)
    wallNode.position = SCNVector3(0, 3.0, -4.9)
    interiorContainer.addChildNode(wallNode)
    
    // Floating Stairs
    for i in 0..<12 {
        let step = SCNBox(width: 1.6, height: 0.1, length: 0.4, chamferRadius: 0.01)
        step.materials = [whiteMat]
        let stepNode = SCNNode(geometry: step)
        stepNode.position = SCNVector3(-3.0 + Float(i) * 0.35, 0.3 + Float(i) * 0.25, -3.5 + Float(i) * 0.15)
        interiorContainer.addChildNode(stepNode)
    }
    
    // Minimalist Sofa & Coffee Table
    let sofa = SCNBox(width: 3.2, height: 0.6, length: 1.2, chamferRadius: 0.05)
    sofa.materials = [sofaMat]
    let sofaNode = SCNNode(geometry: sofa)
    sofaNode.position = SCNVector3(0, 0.3, 0)
    interiorContainer.addChildNode(sofaNode)
    
    let table = SCNBox(width: 1.4, height: 0.3, length: 0.8, chamferRadius: 0.02)
    table.materials = [whiteMat]
    let tableNode = SCNNode(geometry: table)
    tableNode.position = SCNVector3(0, 0.15, 1.4)
    interiorContainer.addChildNode(tableNode)
    
    // Soft Lighting
    let ambientLight = SCNLight()
    ambientLight.type = .ambient
    ambientLight.color = NSColor(white: 0.75, alpha: 1.0)
    let ambNode = SCNNode()
    ambNode.light = ambientLight
    rootNode.addChildNode(ambNode)
    
    let sunLight = SCNLight()
    sunLight.type = .directional
    sunLight.color = NSColor(white: 0.9, alpha: 1.0)
    sunLight.castsShadow = true
    sunLight.shadowRadius = 6.0
    sunLight.shadowColor = NSColor(white: 0, alpha: 0.12)
    let sunNode = SCNNode()
    sunNode.light = sunLight
    sunNode.eulerAngles = SCNVector3(-Float.pi / 3.5, Float.pi / 3, 0)
    rootNode.addChildNode(sunNode)
    
    return (scene, interiorContainer)
}

func createCivil3DScene() -> (SCNScene, SCNNode) {
    let scene = SCNScene()
    scene.background.contents = NSColor.white
    
    let rootNode = scene.rootNode
    let cityContainer = SCNNode()
    rootNode.addChildNode(cityContainer)
    
    let whiteMat = SCNMaterial()
    whiteMat.diffuse.contents = NSColor(white: 0.94, alpha: 1.0)
    
    // Masterplan Base Grid
    let base = SCNBox(width: 9.0, height: 0.2, length: 9.0, chamferRadius: 0)
    base.materials = [whiteMat]
    let baseNode = SCNNode(geometry: base)
    baseNode.position = SCNVector3(0, -0.1, 0)
    cityContainer.addChildNode(baseNode)
    
    // Extruded City Blocks Grid (Plotted Smart Zone)
    for x in -3...3 {
        for z in -3...3 {
            if (x + z) % 2 == 0 {
                let height = Float.random(in: 0.6...2.8)
                let block = SCNBox(width: 0.9, height: CGFloat(height), length: 0.9, chamferRadius: 0.02)
                block.materials = [whiteMat]
                let blockNode = SCNNode(geometry: block)
                blockNode.position = SCNVector3(Float(x) * 1.2, height / 2.0, Float(z) * 1.2)
                cityContainer.addChildNode(blockNode)
            }
        }
    }
    
    // Lighting
    let ambient = SCNLight()
    ambient.type = .ambient
    ambient.color = NSColor(white: 0.72, alpha: 1.0)
    let ambNode = SCNNode()
    ambNode.light = ambient
    rootNode.addChildNode(ambNode)
    
    let dirLight = SCNLight()
    dirLight.type = .directional
    dirLight.color = NSColor(white: 0.88, alpha: 1.0)
    dirLight.castsShadow = true
    dirLight.shadowRadius = 7.0
    dirLight.shadowColor = NSColor(white: 0, alpha: 0.15)
    let dirNode = SCNNode()
    dirNode.light = dirLight
    dirNode.eulerAngles = SCNVector3(-Float.pi / 3, Float.pi / 4, 0)
    rootNode.addChildNode(dirNode)
    
    return (scene, cityContainer)
}

func renderSceneKit3DVideo(config: SceneKitVideoConfig) {
    try? FileManager.default.removeItem(at: config.outputURL)
    
    let (scene, targetNode) = { () -> (SCNScene, SCNNode) in
        switch config.type {
        case "construction": return createConstruction3DScene()
        case "interior": return createInterior3DScene()
        default: return createCivil3DScene()
        }
    }()
    
    let camera = SCNCamera()
    camera.zNear = 0.1
    camera.zFar = 100.0
    let cameraNode = SCNNode()
    cameraNode.camera = camera
    scene.rootNode.addChildNode(cameraNode)
    
    let renderer = SCNRenderer(device: nil, options: nil)
    renderer.scene = scene
    
    guard let writer = try? AVAssetWriter(outputURL: config.outputURL, fileType: .mp4) else {
        print("Failed to create AVAssetWriter")
        return
    }
    
    let videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: config.width,
        AVVideoHeightKey: config.height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 10_000_000,
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
    
    let totalFrames = Int(config.durationSeconds * Double(config.fps))
    let frameDuration = CMTime(value: 1, timescale: config.fps)
    
    let queue = DispatchQueue(label: "scenekit_video_queue")
    let semaphore = DispatchSemaphore(value: 0)
    
    var currentFrame = 0
    let radius: Float = config.type == "interior" ? 7.5 : 11.5
    let heightOffset: Float = config.type == "civil" ? 8.0 : 4.5
    
    writerInput.requestMediaDataWhenReady(on: queue) {
        while writerInput.isReadyForMoreMediaData {
            if currentFrame >= totalFrames {
                writerInput.markAsFinished()
                writer.finishWriting {
                    print("Successfully rendered 3D camera walk-around video: \(config.outputURL.lastPathComponent)")
                    semaphore.signal()
                }
                break
            }
            
            let progress = Double(currentFrame) / Double(totalFrames)
            let angle = Float(progress * Double.pi * 2.0)
            
            // Physical 360-degree smooth 3D camera orbit position
            let camX = radius * cos(angle)
            let camZ = radius * sin(angle)
            let camY = heightOffset + sin(angle * 2.0) * 0.8
            
            cameraNode.position = SCNVector3(camX, camY, camZ)
            
            // Aim camera directly at scene center
            let lookAtConstraint = SCNLookAtConstraint(target: targetNode)
            lookAtConstraint.isGimbalLockEnabled = true
            cameraNode.constraints = [lookAtConstraint]
            
            let presentTime = CMTimeMultiply(frameDuration, multiplier: Int32(currentFrame))
            
            // Render frame snapshot
            let nsImage = renderer.snapshot(
                atTime: Double(currentFrame) / Double(config.fps),
                with: CGSize(width: config.width, height: config.height),
                antialiasingMode: .multisampling4X
            )
            
            if let cgImg = nsImage.cgImage(forProposedRect: nil, context: nil, hints: nil),
               let pxBuffer = createPixelBuffer(from: cgImg, width: config.width, height: config.height) {
                adaptor.append(pxBuffer, withPresentationTime: presentTime)
            }
            
            currentFrame += 1
        }
    }
    
    semaphore.wait()
}

func createPixelBuffer(from image: CGImage, width: Int, height: Int) -> CVPixelBuffer? {
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
    
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let context = CGContext(
        data: CVPixelBufferGetBaseAddress(buffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    ) else { return nil }
    
    context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
    return buffer
}

// EXECUTION
let baseDir = "/Volumes/Nikhil Drive/Nikhil/Codes/Websites/Pragathi/jagathi-platform"
let pubVid = "\(baseDir)/public/assets/videos"

let configs: [SceneKitVideoConfig] = [
    SceneKitVideoConfig(outputURL: URL(fileURLWithPath: "\(pubVid)/construction_loop.mp4"), width: 1280, height: 720, durationSeconds: 10.0, fps: 30, type: "construction"),
    SceneKitVideoConfig(outputURL: URL(fileURLWithPath: "\(pubVid)/interiors_loop.mp4"), width: 1280, height: 720, durationSeconds: 10.0, fps: 30, type: "interior"),
    SceneKitVideoConfig(outputURL: URL(fileURLWithPath: "\(pubVid)/civil_market_loop.mp4"), width: 1280, height: 720, durationSeconds: 10.0, fps: 30, type: "civil")
]

for cfg in configs {
    print("Rendering physical 3D camera walk-around video for \(cfg.outputURL.lastPathComponent)...")
    renderSceneKit3DVideo(config: cfg)
}
