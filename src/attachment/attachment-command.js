import Command from '@ckeditor/ckeditor5-core/src/command'
import { FileRepository } from 'ckeditor5/src/upload'
import { CustomUploadAdapter } from './utils/fileUploader'

export default class AttachmentCommand extends Command {
  execute({ url, files, type = 'insert' }) {
    switch (type) {
      case 'insert':
        this._insertPlaceholder({ url })
        break
      case 'upload':
        this._uploadFiles(files)
        break
      default:
        console.error('unknow attachment command type', { url, files, type })
    }
  }

  refresh() {
    const model = this.editor.model
    const selection = model.document.selection
    const isAllowed = model.schema.checkChild(selection.focus.parent, 'attachment')
    this.isEnabled = isAllowed
  }

  _insertPlaceholder({ url = '', file }) {
    const editor = this.editor
    const selection = editor.model.document.selection
    try {
      let fileName
      let attachment
      if (url) {
        const urlPath = new URL(url).pathname.split('/')
        fileName = urlPath[urlPath.length - 1]
      } else {
        fileName = file?.name || ''
      }

      editor.model.change((writer) => {
        // Create a <attachment> element with the "name" attribute (and all the selection attributes)...
        attachment = writer.createElement('attachment', {
          ...Object.fromEntries(selection.getAttributes()),
          url,
          fileName,
        })
        // ... and insert it into the document.
        editor.model.insertContent(attachment)

        // Put the selection on the inserted element.
        writer.setSelection(attachment, 'on')
      })
      return attachment
    } catch (e) {
      console.error(e)
    }
  }

  _uploadFiles(files) {
    console.log('files', files)
    if (!files?.length) {
      return
    }
    for (const file of files) {
      this._uploadFile(file)
    }
  }

  async _uploadFile(file) {
    const editor = this.editor
    // const selection = editor.model.document.selection
    const loader = new CustomUploadAdapter(editor, file) // use custom file uploader
    const attachment = this._insertPlaceholder({ file })
    const urls = await loader.upload()
    // const attrsMap = attachment._attrs
    // attrsMap.set('url', urls.default)

    editor.model.change((writer) => {
      // console.log('writer', urls.default, attachment)
      writer.setAttribute('url', urls.default, attachment)
    })
    // console.log('url', urls, attachment, attachment.getAttributes())
  }

  /**
   * Handles uploading single file.
   *
   * @private
   * @param {File} file
   * @param {Object} attributes
   * @param {module:engine/model/position~Position} position
   */
  _uploadImage(file, attributes, position) {
    const editor = this.editor
    const fileRepository = editor.plugins.get(FileRepository)
    const loader = fileRepository.createLoader(file)
    const imageUtils = editor.plugins.get('ImageUtils')

    // Do not throw when upload adapter is not set. FileRepository will log an error anyway.
    if (!loader) {
      return
    }

    imageUtils.insertImage({ ...attributes, uploadId: loader.id }, position)
  }
}
