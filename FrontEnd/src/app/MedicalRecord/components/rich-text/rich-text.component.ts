import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Output , EventEmitter, Input} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text',
  standalone:true,
  imports:[CommonModule,
    QuillEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule],
  templateUrl:'./rich-text.component.html',
  styleUrl: './rich-text.component.css'
})
export class RichTextComponent implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  quillConfig={
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        //['link'],
        //['link', 'image', 'video']  
      ],
      
    }
  };

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
  
  onContentChange() {
    this.contentChange.emit(this.content);
  }
}
