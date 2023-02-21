"use strict";(self.webpackChunkmirador_mosaic=self.webpackChunkmirador_mosaic||[]).push([[792],{"./src/stories/Tile.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{OneUp:()=>OneUp,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../mirador/node_modules/react/index.js"),_components_Tile__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Tile.js"),react_dnd_multi_backend__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react-dnd-multi-backend/dist/index.js"),rdndmb_html5_to_touch__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/rdndmb-html5-to-touch/dist/index.js"),_context_GridProvider__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/context/GridProvider.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../mirador/node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Tile",component:_components_Tile__WEBPACK_IMPORTED_MODULE_1__.Z},Wrapper=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_dnd_multi_backend__WEBPACK_IMPORTED_MODULE_4__.WG,{options:rdndmb_html5_to_touch__WEBPACK_IMPORTED_MODULE_5__.r,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_context_GridProvider__WEBPACK_IMPORTED_MODULE_2__.kc,{childIds:react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).map((c=>c.props.id)),children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{style:{position:"absolute",inset:"10%",display:"grid",gridAutoRows:"25%",gridAutoColumns:"25%"},children})})});Wrapper.displayName="Wrapper";const Window=({id,children,dragHandle,style,...props})=>{const dispatch=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_GridProvider__WEBPACK_IMPORTED_MODULE_2__.AL);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{id,...props,style:{height:"100%",border:"1px solid rgba(0,0,0,0.3)",...style},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{ref:dragHandle,style:{backgroundColor:"rgba(0,0,0,0.3)",cursor:"move"},children:["Drag handle",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button",{onClick:()=>{dispatch({type:"remove",id})},children:"x"})]}),children]})};Window.displayName="Window";const OneUp=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Wrapper,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Tile__WEBPACK_IMPORTED_MODULE_1__.Z,{id:"a",targetStyle:{backgroundColor:"red",opacity:.3},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Window,{children:"A"})})});OneUp.displayName="OneUp",OneUp.parameters={...OneUp.parameters,docs:{...OneUp.parameters?.docs,source:{originalSource:"() => <Wrapper><Tile id=\"a\" targetStyle={{\n    backgroundColor: 'red',\n    opacity: 0.3\n  }}><Window>A</Window></Tile></Wrapper>",...OneUp.parameters?.docs?.source}}};const __namedExportsOrder=["OneUp"];OneUp.__docgenInfo={description:"",methods:[],displayName:"OneUp"}}}]);