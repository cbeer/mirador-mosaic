"use strict";(self.webpackChunkmirador_mosaic=self.webpackChunkmirador_mosaic||[]).push([[419],{"./src/stories/Grid.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ComplexGrid:()=>ComplexGrid,Primary:()=>Primary,ProvidedGrid:()=>ProvidedGrid,TwoUp:()=>TwoUp,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Grid_stories});var react=__webpack_require__("./node_modules/react/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),dist=__webpack_require__("./node_modules/react-dnd-multi-backend/dist/index.js"),rdndmb_html5_to_touch_dist=__webpack_require__("./node_modules/rdndmb-html5-to-touch/dist/index.js"),useDrop=__webpack_require__("./node_modules/react-dnd/dist/hooks/useDrop/useDrop.js");const mergeRefs=(...refs)=>node=>{refs.forEach((ref=>{"function"==typeof ref?ref(node):ref.current=node}))};var DropTarget=__webpack_require__("./src/components/DropTarget.js"),Tile=__webpack_require__("./src/components/Tile.js"),GridProvider=__webpack_require__("./src/context/GridProvider.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const calculateGridStyles=gridTemplate=>({gridTemplateRows:gridTemplate.rows.map((row=>`${row}fr`)).join(" "),gridTemplateColumns:gridTemplate.columns.map((col=>`minmax(max-content, ${col}fr)`)).join(" "),gridTemplateAreas:gridTemplate.areas.map((row=>`"${row.join(" ")}"`)).join("\n"),gridAutoRows:"0px"});function Container({children,style,...props}){const ref=(0,react.useRef)(null),gridTemplate=(0,react.useContext)(GridProvider._p),{temporaryLayout}=gridTemplate,dispatch=(0,react.useContext)(GridProvider.AL),[width,setWidth]=(0,react.useState)(0),[height,setHeight]=(0,react.useState)(0),gridStyle={position:"absolute",inset:0,display:"grid",gap:"16px",justifyItems:"stretch",alignItems:"stretch",...style,...calculateGridStyles(temporaryLayout||gridTemplate)},resizeWindow=(0,react.useCallback)(((item,diff,final)=>{dispatch({final,type:"resize",id:item.box,dir:item.dir,value:{top:"top"===item.dir?diff.y/height:0,bottom:"bottom"===item.dir?diff.y/height:0,left:"left"===item.dir?diff.x/width:0,right:"right"===item.dir?diff.x/width:0}})}),[dispatch,width,height]),[,borderDrop]=(0,useDrop.L)((()=>({accept:"mirador.handle",drop(item,monitor){resizeWindow(item,monitor.getDifferenceFromInitialOffset(),!0)},hover(item,monitor){monitor.canDrop()&&resizeWindow(item,monitor.getDifferenceFromInitialOffset(),!1)}})),[resizeWindow]),[{isOver},windowDrop]=(0,useDrop.L)((()=>({accept:"mirador.window",drop(item,monitor){const result=monitor.getDropResult();dispatch(result?{type:"drop",id:item.id,box:result.box,dir:result.dir}:{type:"end_drag"})},hover({id}){dispatch({type:"start_drag",id})},collect:monitor=>({isOver:monitor.isOver()})})),[dispatch]),onDropFailed=(0,react.useCallback)((()=>{dispatch({type:"end_drag"})}),[dispatch]);return(0,react.useLayoutEffect)((()=>{ref.current&&(setWidth(ref.current.getBoundingClientRect().width),setHeight(ref.current.getBoundingClientRect().height))}),[]),(0,jsx_runtime.jsxs)("div",{ref:mergeRefs(ref,windowDrop,borderDrop),style:gridStyle,...props,children:[(0,jsx_runtime.jsx)(DropTarget.Z,{isOver,box:"root",size:"25px"}),react.Children.map(children,(child=>(0,jsx_runtime.jsx)(Tile.Z,{id:child.props.id,onDropFailed,children:child})))]})}function Grid({children,dragAndDropManager,initialLayout,...props}){return(0,jsx_runtime.jsx)(dist.WG,{options:rdndmb_html5_to_touch_dist.r,...dragAndDropManager&&{manager:dragAndDropManager},children:(0,jsx_runtime.jsx)(GridProvider.kc,{value:initialLayout,childIds:react.Children.toArray(children).map((c=>c.props.id)),children:(0,jsx_runtime.jsx)(Container,{...props,children})})})}Container.displayName="Container",Container.propTypes={children:prop_types_default().node.isRequired,style:prop_types_default().object},Grid.displayName="Grid",Grid.propTypes={children:prop_types_default().node.isRequired,initialLayout:prop_types_default().shape({rows:prop_types_default().arrayOf(prop_types_default().number),columns:prop_types_default().arrayOf(prop_types_default().number),areas:prop_types_default().arrayOf(prop_types_default().arrayOf(prop_types_default().string))}),dragAndDropManager:prop_types_default().object},Grid.__docgenInfo={description:"",methods:[],displayName:"Grid",props:{children:{description:"",type:{name:"node"},required:!0},initialLayout:{description:"",type:{name:"shape",value:{rows:{name:"arrayOf",value:{name:"number"},required:!1},columns:{name:"arrayOf",value:{name:"number"},required:!1},areas:{name:"arrayOf",value:{name:"arrayOf",value:{name:"string"}},required:!1}}},required:!1},dragAndDropManager:{description:"",type:{name:"object"},required:!1}}};const components_Grid=Grid,Grid_stories={title:"Grid",component:components_Grid},Window=({id,children,dragHandle,style,...props})=>{const dispatch=react.useContext(GridProvider.AL);return(0,jsx_runtime.jsxs)("div",{id,...props,style:{height:"100%",border:"1px solid rgba(0,0,0,0.3)",...style},children:[(0,jsx_runtime.jsxs)("div",{ref:dragHandle,style:{backgroundColor:"rgba(0,0,0,0.3)",cursor:"move",display:"flex",justifyContent:"space-between"},children:[(0,jsx_runtime.jsx)("span",{children:"Drag handle"}),(0,jsx_runtime.jsx)("button",{onClick:()=>{dispatch({type:"remove",id})},children:"x"})]}),children]})};Window.displayName="Window";const intToPlaceholder=i=>String.fromCharCode(65+i),Template=({howManyWindows=0,args})=>(0,jsx_runtime.jsx)(components_Grid,{...args,children:Array(howManyWindows).fill().map(((v,i)=>(0,jsx_runtime.jsx)(Window,{id:intToPlaceholder(i),children:intToPlaceholder(i)},i)))});Template.displayName="Template";const Primary=Template.bind({});Primary.args={howManyWindows:1};const TwoUp=()=>(0,jsx_runtime.jsxs)(components_Grid,{children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"})]});TwoUp.displayName="TwoUp";const ProvidedGrid=()=>(0,jsx_runtime.jsxs)(components_Grid,{initialLayout:{rows:[1,1],columns:[1,1],areas:[["a","a"],["b","c"]]},children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"}),(0,jsx_runtime.jsx)(Window,{id:"c",children:"C"})]});ProvidedGrid.displayName="ProvidedGrid";const ComplexGrid=()=>(0,jsx_runtime.jsxs)(components_Grid,{initialLayout:{rows:[1,1,1,1],columns:[1,1,1,1,1],areas:[["a","a","a","a","a"],["d","c","f","f","f"],["d","c","f","f","f"],["d","b","e","e","e"]]},children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"}),(0,jsx_runtime.jsx)(Window,{id:"c",children:"C"}),(0,jsx_runtime.jsx)(Window,{id:"d",children:"D"}),(0,jsx_runtime.jsx)(Window,{id:"e",children:"E"}),(0,jsx_runtime.jsx)(Window,{id:"f",children:"F"})]});ComplexGrid.displayName="ComplexGrid",Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"({\n  howManyWindows = 0,\n  args\n}) => <Grid {...args}>{Array(howManyWindows).fill().map((v, i) => <Window key={i} id={intToPlaceholder(i)}>{intToPlaceholder(i)}</Window>)}</Grid>",...Primary.parameters?.docs?.source}}},TwoUp.parameters={...TwoUp.parameters,docs:{...TwoUp.parameters?.docs,source:{originalSource:'() => <Grid><Window id="a">A</Window><Window id="b">B</Window></Grid>',...TwoUp.parameters?.docs?.source}}},ProvidedGrid.parameters={...ProvidedGrid.parameters,docs:{...ProvidedGrid.parameters?.docs,source:{originalSource:'() => <Grid initialLayout={{\n  rows: [1, 1],\n  columns: [1, 1],\n  areas: [["a", "a"], ["b", "c"]]\n}}><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>',...ProvidedGrid.parameters?.docs?.source}}},ComplexGrid.parameters={...ComplexGrid.parameters,docs:{...ComplexGrid.parameters?.docs,source:{originalSource:'() => <Grid initialLayout={{\n  rows: [1, 1, 1, 1],\n  columns: [1, 1, 1, 1, 1],\n  areas: [["a", "a", "a", "a", "a"], ["d", "c", "f", "f", "f"], ["d", "c", "f", "f", "f"], ["d", "b", "e", "e", "e"]]\n}}>\n    <Window id="a">A</Window>\n    <Window id="b">B</Window>\n    <Window id="c">C</Window>\n    <Window id="d">D</Window>\n    <Window id="e">E</Window>\n    <Window id="f">F</Window>\n  </Grid>',...ComplexGrid.parameters?.docs?.source}}};const __namedExportsOrder=["Primary","TwoUp","ProvidedGrid","ComplexGrid"];TwoUp.__docgenInfo={description:"",methods:[],displayName:"TwoUp"},ProvidedGrid.__docgenInfo={description:"",methods:[],displayName:"ProvidedGrid"},ComplexGrid.__docgenInfo={description:"",methods:[],displayName:"ComplexGrid"}}}]);