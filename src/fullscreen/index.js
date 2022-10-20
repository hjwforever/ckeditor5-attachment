import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import FullscreenUI from './fullscreen-ui'
import FullscreenEditing from './fullscreen-editing'

export default class Fullscreen extends Plugin {
  static get requires() {
    return [FullscreenEditing, FullscreenUI]
  }
}
