/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2024-06-15
 * @version 2.1.1
 */

import React from 'react';
import FileSaver from 'file-saver';

// elemental components
import LinkButton from '~/components/ui/LinkButton';
import XmlEditorInput from '~/components/ui/XmlEditorInput';
import PopoverTextInput from '~/components/ui/PopoverTextInput';

// components
import XmlImporter from './XmlImporter';

// icons
import {COLOR_REDDISH, IconDownload, IconPencilLine} from '~/components/icons/app';

// redux
import {updateName} from '~redux/slices/environment/reducers';
import {useAppDispatch, useAppSelector} from '~redux/hooks';

const TemplateXMLViewer = () => {
  const dispatch = useAppDispatch();

  const template = useAppSelector(({environment}) => environment.template);
  const fileName = useAppSelector(({environment}) => environment.name);

  return (
    <>
      <div className="mb-2">
        <XmlEditorInput
          editorProps={{
            readOnly: true,
            highlightActiveLine: false,
            height: '80vh', fontSize: 14,
            showPrintMargin: false,
            setOptions: {
              foldStyle: 'manual',
            },
          }}
          hideClearButton
          value={template.trim()}
          buttons={(
            <>
              <LinkButton
                disabled={!template.trim()}
                className="pt-0 pb-0"
                title={`Download scenario xml file: '${fileName}'`}
                onClick={() => {
                  const blob = new Blob([template], {type: 'text/xml;charset=utf-8'});
                  FileSaver.saveAs(blob, fileName);
                }}>
                <IconDownload/> Download
              </LinkButton>
              <XmlImporter/>
            </>
          )}
          rightButtons={(
            <div className="d-flex align-items-start">
              <span className="mr-1"><IconPencilLine/> Environment:</span>
              <PopoverTextInput
                hideArrow
                caseType="SNAKE_CASE"
                value={fileName}
                inputProps={{
                  placeholder: 'e.g., my_environment',
                  maxLength: 30,
                }}
                style={{top: -2}}
                formatValue={value => (
                  <>
                      <span
                        className="text-underline-dotted"
                        style={{color: COLOR_REDDISH}}>
                        {value}
                      </span>
                  </>
                )}
                onSave={value => value.trim() && dispatch(updateName(value))}
              />
            </div>
          )}
        />
      </div>
    </>
  );
};

export default TemplateXMLViewer;
