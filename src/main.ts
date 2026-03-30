import { RobotArm } from './core/RobotArm'
import { Scene } from './core/Scene'
import './styles/main.scss'
import { ControlPanel } from './ui/ControlPanel'
import { log } from './ui/Log'

class RobotArmSimulation {
  private scene!: Scene
  private robotArm!: RobotArm
  private controlPanel!: ControlPanel

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    try {
      // Get container
      const container = document.getElementById('app')
      if (!container) {
        throw new Error('找不到应用容器')
      }

      log.info('系统初始化开始...')

      // Create scence
      this.scene = new Scene(container)
      log.success('3D场景创建完成')

      // Create robot arm
      this.robotArm = new RobotArm(this.scene.getScene())
      log.info('机械臂实例创建完成')

      // Loads robot arm model
      await this.robotArm.loadModel('arm.glb')
      setTimeout(() => {
        document.querySelector('.loader-container')?.classList.add('loaded')
      }, 500)
      log.success('Robot arm model loaded')

      // Create control panel
      this.controlPanel = ControlPanel.getInstance()
      this.controlPanel.bindScene(this.scene)
      this.controlPanel.bindRobotArm(this.robotArm)
      log.success('ControlPanel initialized')

      // Start render loop
      this.update()
      console.log('Robot arm simulation initialized')
      log.success('Robot arm simulation initialized')
    } catch (error) {
      console.error('Initialized failed:', error)
      log.error(`Initialized failed: ${error}`)
      this.showError('Initialized failed，check console for details')
    }
  }

  private update(): void {
    requestAnimationFrame(this.update.bind(this))
    this.scene.update()
    this.robotArm.update()
  }

  private showError(message: string): void {
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      z-index: 10000;
    `
    errorDiv.textContent = message
    document.body.appendChild(errorDiv)
  }
}

// Start application
new RobotArmSimulation()
