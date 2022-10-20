import Command from '@ckeditor/ckeditor5-core/src/command'

export default class FullscreenCommand extends Command {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'FullscreenCommand'
  }

  execute() {
    const ele = document.getElementsByClassName('ck-editor')[0]
    const { afterFullscreen, afterExitFullscreen } = this.editor.config.get('fullscreenConfig')
    this._addFullscreenListener({ afterFullscreen, afterExitFullscreen })
    this._toggleFullscreen(ele)
  }

  _toggleFullscreen(element) {
    const isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)
    if (isFull) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
    }
  }

  _addFullscreenListener({ afterFullscreen = () => {}, afterExitFullscreen = () => {} }) {
    const fullscreenHandler = () => {
      const contentContainerEle = document.getElementsByClassName('ck-editor__main')[0]
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
      if (fullscreenElement) {
        contentContainerEle && contentContainerEle.classList.add('ck-fullscreen')
        afterFullscreen()
      } else {
        contentContainerEle && contentContainerEle.classList.remove('ck-fullscreen')
        afterExitFullscreen()
        document.removeEventListener('fullscreenchange', fullscreenHandler)
      }
    }
    document.addEventListener('fullscreenchange', fullscreenHandler)
  }
}
