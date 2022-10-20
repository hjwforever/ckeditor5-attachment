// placeholder/placeholder.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import AttachmentEditing from './attachment-editing'
import AttachmentUI from './attachment-ui'

export default class Attachment extends Plugin {
  static get requires() {
    return [AttachmentEditing, AttachmentUI]
  }
}
