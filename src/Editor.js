import React, { Fragment, useEffect, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import Template from "./templates/Template"
import parse from "html-react-parser";
import axios from "axios"

const Editor = () => {

  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
  })


  const postData = async () => {
    const result = await axios.post("http://localhost:5000/values", parse(editor.getHtml().toString()));
    console.log(result);
  }

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100vh',
      width: 'auto',
      storageManager: {
        id: "gjs-",
        type: 'remote',
        stepsBeforeSave: 1,
        urlStore: 'http://localhost:5000/values',
        urlLoad: 'http://localhost:5000/values',
        autosave: true,         // Store data automatically
        autoload: true,         // Autoload stored data on init
        stepsBeforeSave: 1,     // If autosave enabled, indicates how many changes are necessary before store method is triggered
        storeComponents: true,  // Enable/Disable storing of components in JSON format
        storeStyles: true,      // Enable/Disable storing of rules in JSON format
        storeHtml: true,        // Enable/Disable storing of components as HTML string
        storeCss: true,         // Enable/Disable storing of rules as CSS string
      }
    });

    editor.Panels.addPanel({
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<u>B</u>',
          command: 'sw-visibility', // Built-in command
        }, {
          id: 'export',
          className: 'btn-open-export',
          label: 'Exp',
          command: 'export-template',
          context: 'export-template', // For grouping context of buttons from the same panel
        },
        {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor) {
            editor.Modal.setTitle('Components JSON')
              .setContent(`<textarea style="width:100%; height: 250px;">
                ${JSON.stringify(editor.getComponents())}
              </textarea>`)
              .open();
          }
        },
        {
          id: 'store-data',
          className: 'btn btn-primary',
          label: 'Save',
          context: 'Save',
          command(editor) {
            editor.store(
              postData()
            )
          }
        }
      ],
    });



    parse(editor.getHtml().toString())

  }, []);

  return (
    <Fragment>
      <div id="gjs">
        <Template />
      </div>
    </Fragment>
  );
};

export default Editor;
