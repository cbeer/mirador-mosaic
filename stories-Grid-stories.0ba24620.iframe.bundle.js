"use strict";(self.webpackChunkmirador_mosaic=self.webpackChunkmirador_mosaic||[]).push([[419],{"./src/stories/Grid.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ComplexGrid:()=>ComplexGrid,InitialGrid:()=>InitialGrid,OneUp:()=>OneUp,ThreeUp:()=>ThreeUp,TwoUp:()=>TwoUp,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Grid_stories});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/react-dnd-multi-backend/dist/index.js"),rdndmb_html5_to_touch_dist=__webpack_require__("./node_modules/rdndmb-html5-to-touch/dist/index.js"),useDrop=__webpack_require__("./node_modules/react-dnd/dist/hooks/useDrop/useDrop.js");const mergeRefs=(...refs)=>node=>{for(const ref of refs)"function"==typeof ref?ref(node):ref.current=node};var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const DropTarget=({box,dir,size,style,...props})=>{const[{isOver,dropAreaStyles},drop]=(0,useDrop.L)((()=>({accept:"mirador.window",drop:(item,monitor)=>({dir}),hover:(item,monitor)=>({dir}),collect:monitor=>({isOver:monitor.getItem()?.id!=box&&monitor.isOver({shallow:!0})&&monitor.canDrop(),dropAreaStyles:monitor.getItem()?.id!=box&&monitor.isOver()&&monitor.canDrop()?{backgroundColor:"rgba(255, 0,0,0.7)"}:{}})})),[]),position={top:{bottom:`calc(100% - ${size})`},bottom:{top:`calc(100% - ${size})`},left:{right:`calc(100% - ${size})`},right:{left:`calc(100% - ${size})`}};return(0,jsx_runtime.jsx)("div",{ref:drop,style:{position:"absolute",left:0,right:0,top:0,bottom:0,...position[dir]||{},...style,...dropAreaStyles}})};DropTarget.displayName="DropTarget";const DropTargetContainer=({isOver=!1,padding=0,size="30%",style})=>(0,jsx_runtime.jsxs)("div",{style:{position:"absolute",left:padding,right:padding,top:padding,bottom:padding,...style},children:[(0,jsx_runtime.jsx)(DropTarget,{dir:"top",size,style:{zIndex:isOver?1:void 0}}),(0,jsx_runtime.jsx)(DropTarget,{dir:"bottom",size,style:{zIndex:isOver?1:void 0}}),(0,jsx_runtime.jsx)(DropTarget,{dir:"left",size,style:{zIndex:isOver?1:void 0}}),(0,jsx_runtime.jsx)(DropTarget,{dir:"right",size,style:{zIndex:isOver?1:void 0}})]});DropTargetContainer.displayName="DropTargetContainer",DropTargetContainer.__docgenInfo={description:"",methods:[],displayName:"DropTargetContainer",props:{isOver:{defaultValue:{value:"false",computed:!1},required:!1},padding:{defaultValue:{value:"0",computed:!1},required:!1},size:{defaultValue:{value:"'30%'",computed:!1},required:!1}}};const components_DropTarget=DropTargetContainer;var useDrag=__webpack_require__("./node_modules/react-dnd/dist/hooks/useDrag/useDrag.js");function DragHandle({box,dir,style,...props}){const[{isDragging,opacity},drag,preview]=(0,useDrag.c)((()=>({type:"mirador.handle",item:{box,dir},collect:monitor=>({isDragging:monitor.isDragging(),opacity:monitor.isDragging()?0:1})})),[]),handleStyles={backgroundColor:"rgba(0,0,0,0.5)",position:"absolute",...style};return(0,jsx_runtime.jsx)("div",{ref:preview,style:{...handleStyles,opacity:isDragging?1:0},children:(0,jsx_runtime.jsx)("div",{ref:drag,style:{position:"absolute",top:0,left:0,right:0,bottom:0,opacity:0}})})}function Tile({children,id,onDropFailed=()=>{},gridArea=id,...props}){const[{isDragging,opacity},dragHandle,preview]=(0,useDrag.c)((()=>({type:"mirador.window",item:{id},collect:monitor=>({isDragging:monitor.isDragging(),opacity:monitor.isDragging()?.4:1}),end:(item,monitor)=>{monitor.didDrop()||onDropFailed({id})}}))),[{isOver},drop]=(0,useDrop.L)((()=>({accept:"mirador.window",drop:(item,monitor)=>({...monitor.getDropResult(),box:id}),hover:(item,monitor)=>({...monitor.getDropResult(),box:id}),collect:monitor=>({isOver:monitor.getItem()?.id!=id&&monitor.isOver()})})),[]),tileStyle={gridArea,display:isDragging?"none":"block",position:isDragging?"absolute":"relative"},windowStyle={position:"relative",opacity,width:"100%",height:"100%"};return(0,jsx_runtime.jsxs)("div",{ref:drop,style:tileStyle,children:[(0,jsx_runtime.jsx)(components_DropTarget,{isOver,box:id,padding:4}),(0,jsx_runtime.jsx)("div",{ref:preview,style:windowStyle,children:(0,react.cloneElement)(children,{dragHandle})}),(0,jsx_runtime.jsx)(ResizeControls,{box:id})]})}DragHandle.displayName="DragHandle",Tile.displayName="Tile";const ResizeControls=props=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(DragHandle,{...props,dir:"left",style:{left:-2,width:5,top:0,bottom:0,cursor:"ew-resize"}}),(0,jsx_runtime.jsx)(DragHandle,{...props,dir:"top",style:{top:-2,height:5,left:0,right:0,cursor:"ns-resize"}}),(0,jsx_runtime.jsx)(DragHandle,{...props,dir:"right",style:{right:-2,width:5,top:0,bottom:0,cursor:"ew-resize"}}),(0,jsx_runtime.jsx)(DragHandle,{...props,dir:"bottom",style:{bottom:-2,height:5,left:0,right:0,cursor:"ns-resize"}})]});Tile.__docgenInfo={description:"",methods:[],displayName:"Tile",props:{onDropFailed:{defaultValue:{value:"() => {}",computed:!1},required:!1},gridArea:{defaultValue:{value:"id",computed:!0},required:!1}}};const components_Tile=Tile,calculateGridStyles=gridTemplate=>({gridTemplateRows:gridTemplate.rows.map((row=>`${row}fr`)).concat(["0px"]).join(" "),gridTemplateColumns:gridTemplate.columns.map((col=>`minmax(max-content, ${col}fr)`)).join(" "),gridTemplateAreas:gridTemplate.areas.map((row=>`"${row.join(" ")}"`)).join("\n"),gridAutoRows:"0px"}),removeEmptyGridRowCols=({rows,columns,areas,...other})=>({rows:rows.filter((row=>row>0)),columns:columns.filter((col=>col>0)),areas:areas.filter(((row,i)=>rows[i]>0)).map((rows=>rows.filter(((v,i)=>columns[i]>0)))),...other}),cleanupRedundantRows=({rows,columns,areas,...other})=>{const rowsToCompact=areas.map(((row,i)=>areas[i-1]&&row.every(((v,j)=>v==areas[i-1][j]))?i:null)).filter((v=>null!=v));return{rows:rows.map(((c,i)=>rowsToCompact.includes(i+1)?c+rows[i+1]:c)).filter(((v,i)=>!rowsToCompact.includes(i))),columns,areas:areas.filter(((row,i)=>!rowsToCompact.includes(i))),...other}},cleanupRedundantColumns=({rows,columns,areas,...other})=>{const columnsToCompact=columns.map(((_c,i)=>{if(0==i)return null;const prevCol=areas.map((row=>row[i-1]));return areas.map((row=>row[i])).every(((v,j)=>v==prevCol[j]))?i:null}));return{rows,columns:columns.map(((c,i)=>columnsToCompact.includes(i+1)?c+columns[i+1]:c)).filter(((v,i)=>!columnsToCompact.includes(i))),areas:areas.map((row=>row.filter(((v,i)=>!columnsToCompact.includes(i))))),...other}},cleanupPlaceholderColumns=({rows,columns,areas,...other})=>{const columnsToRemove=columns.map(((c,i)=>areas.every((row=>"."==row[i]))?i:null)).filter((v=>null!=v)),newColumns=columns.filter(((v,i)=>!columnsToRemove.includes(i))),adj=columns.reduce(((a,b)=>a+b))/newColumns.reduce(((a,b)=>a+b));return{rows,columns:newColumns.map((c=>c*adj)),areas:areas.map((row=>row.filter(((v,i)=>!columnsToRemove.includes(i))))),...other}},cleanupPlaceholderRows=({rows,columns,areas,...other})=>{const rowsToRemove=rows.map(((c,i)=>areas[i].every((v=>"."==v))?i:null)).filter((v=>null!=v)),newRows=rows.filter(((v,i)=>!rowsToRemove.includes(i))),adj=rows.reduce(((a,b)=>a+b))/newRows.reduce(((a,b)=>a+b));return{rows:newRows.map((c=>c*adj)),columns,areas:areas.filter(((row,i)=>!rowsToRemove.includes(i))),...other}},attemptBinPacking=({rows,columns,areas,dir="left",...other})=>{if(0==areas.reduce(((sum,row)=>sum+row.filter((v=>"."==v)).length)))return{rows,columns,areas};const spans=(areas=>{const spans=new Map;return areas.forEach(((row,i)=>{row.forEach(((v,j)=>{spans.has(v)||spans.set(v,{id:v,top:Number.MAX_SAFE_INTEGER,left:Number.MAX_SAFE_INTEGER,bottom:-1,right:-1});const obj=spans.get(v);obj.top=Math.min(obj.top,i),obj.left=Math.min(obj.left,j),obj.bottom=Math.max(obj.bottom,i),obj.right=Math.max(obj.right,j)}))})),spans})(areas),horizontal=[areas.map(((row,i)=>row.map(((v,j)=>{if("."!=v)return v;const span=spans.get(v),neighbor=spans.get(row[j-1]);return neighbor&&neighbor.top>=span.top&&neighbor.bottom<=span.bottom?row[j-1]:"."})))),areas.map(((row,i)=>row.map(((v,j)=>{if("."!=v)return v;const span=spans.get(v),neighbor=spans.get(row[j+1]);return neighbor&&neighbor.top>=span.top&&neighbor.bottom<=span.bottom?row[j+1]:"."}))))],vertical=[areas.map(((row,i)=>row.map(((v,j)=>{if("."!=v||0==i)return v;const span=spans.get(v),neighbor=spans.get(areas[i-1][j]);return neighbor&&neighbor.left>=span.left&&neighbor.right<=span.right?areas[i-1][j]:"."})))),areas.map(((row,i)=>row.map(((v,j)=>{if("."!=v||i==areas.length-1)return v;const span=spans.get(v),neighbor=spans.get(areas[i+1][j]);return neighbor&&neighbor.left>=span.left&&neighbor.right<=span.right?areas[i+1][j]:"."}))))];return{rows,columns,areas:("left"==dir||"right"==dir?[areas,...horizontal,...vertical]:[areas,...vertical,...horizontal]).reduce(((best,next)=>{const bestScore=best.reduce(((sum,row)=>sum+row.filter((v=>"."==v)).length),0);return next.reduce(((sum,row)=>sum+row.filter((v=>"."==v)).length),0)<bestScore?next:best})),...other}},iterativeBinPacking=grid=>{const iterations=Math.max(grid.columns.length,grid.rows.length);return Array(iterations).fill(0).reduce(((g,i)=>attemptBinPacking(g)),grid)},cleanupGrid=grid=>[removeEmptyGridRowCols,cleanupRedundantRows,cleanupRedundantColumns,cleanupPlaceholderColumns,cleanupPlaceholderRows,iterativeBinPacking].reduce(((grid,step)=>step(grid)||grid),grid),insertColumn=({rows,columns,areas,...other},index,size,{fill,resize=!1}={})=>{const colSize=columns.reduce(((a,b)=>a+b)),adj=resize?1-size/colSize:1;return{rows,columns:[...columns.slice(0,index).map((i=>i*adj)),size,...columns.slice(index).map((i=>i*adj))],areas:areas.map((row=>[...row.slice(0,index),fill||row[index],...row.slice(index)])),...other}},splitColumn=(gridTemplate,index)=>{const{rows,columns,areas,...other}=insertColumn(gridTemplate,index,gridTemplate.columns[index]);return{rows,columns:[...columns.slice(0,index),columns[index]/2,columns[index]/2,...columns.slice(index+2)],areas,...other}},insertRow=({rows,columns,areas,...other},index,size,{fill,resize=!1}={})=>{const rowSize=rows.reduce(((a,b)=>a+b)),adj=resize&&size!=rowSize?1-size/rowSize:1;return{rows:[...rows.slice(0,index).map((i=>i*adj)),size,...rows.slice(index).map((i=>i*adj))],columns,areas:[...areas.slice(0,index),fill||areas[index],...areas.slice(index)],...other}},splitRow=(gridTemplate,index)=>{const{rows,columns,areas,...other}=insertRow(gridTemplate,index,gridTemplate.rows[index]);return{rows:[...rows.slice(0,index),rows[index]/2,rows[index]/2,...rows.slice(index+2)],columns,areas,...other}},getBounds=({areas},id)=>{const row=areas.find((row=>row.includes(id)));return{right:row.lastIndexOf(id),left:row.indexOf(id),top:areas.findIndex((row=>row.includes(id))),bottom:areas.findLastIndex((row=>row.includes(id)))}},Container=({children,initialLayout,style,...props})=>{const ref=(0,react.useRef)(null),chArray=react.Children.toArray(children),[gridTemplate,setGridTemplate]=(0,react.useState)(cleanupGrid(initialLayout||{rows:[1],columns:chArray.map((_child=>1)),areas:[chArray.map((child=>child.props.id))]})),[temporaryGridTemplate,setTemporaryGridTemplate]=(0,react.useState)(gridTemplate),[width,setWidth]=(0,react.useState)(0),[height,setHeight]=(0,react.useState)(0),gridStyle={position:"absolute",left:0,right:0,top:0,bottom:0,display:"grid",gap:"16px",justifyItems:"stretch",alignItems:"stretch",...style,...calculateGridStyles(temporaryGridTemplate||gridTemplate)},resizeWindow=(0,react.useCallback)(((item,diff,final)=>{const cb=final?props=>{setTemporaryGridTemplate(null),setGridTemplate(cleanupGrid(props))}:props=>setTemporaryGridTemplate(props),{rows,columns}=gridTemplate,widthFrs=columns.reduce(((a,b)=>a+b)),heightFrs=rows.reduce(((a,b)=>a+b));cb(((gridTemplate,item,dir,size)=>{const{rows,columns}=gridTemplate,bounds=getBounds(gridTemplate,item.box),blah={right:[0,1],left:[-1,0],top:[-1,0],bottom:[0,1]};if(0!=size&&!("right"==dir&&bounds.right==columns.length-1||"left"==dir&&0==bounds.left||"top"==dir&&0==bounds.top||"bottom"==dir&&bounds.bottom==rows.length-1)){if("right"==dir||"left"==dir){const[colToDuplicate,colToStealSizeFrom]=size>0?blah[dir]:blah[dir].reverse();return(({rows,columns,areas,...other},func)=>({rows,columns:columns.map(func),areas,...other}))(insertColumn(gridTemplate,bounds[dir]+colToDuplicate,Math.abs(size),{source:item.box}),((v,i)=>i==bounds[dir]+colToStealSizeFrom+(colToDuplicate<=colToStealSizeFrom?1:0)?Math.max(0,v-Math.abs(size)):v))}if("top"==dir||"bottom"==dir){const[rowToDuplicate,rowToStealSizeFrom]=size>0?blah[dir]:blah[dir].reverse();return(({rows,columns,areas,...other},func)=>({rows:rows.map(func),columns,areas,...other}))(insertRow(gridTemplate,bounds[dir]+rowToDuplicate,Math.abs(size),{source:item.box}),((v,i)=>i==bounds[dir]+rowToStealSizeFrom+(rowToDuplicate<=rowToStealSizeFrom?1:0)?Math.max(0,v-Math.abs(size)):v))}}})(gridTemplate,item,item.dir,"right"==item.dir||"left"==item.dir?diff.x/width*widthFrs:diff.y/height*heightFrs)||gridTemplate)}),[gridTemplate,width,height]),moveWindow=(0,react.useCallback)((({id},{box="root",dir},final)=>{const cb=final?props=>{setTemporaryGridTemplate(null),setGridTemplate(cleanupGrid({...props,dir}))}:setTemporaryGridTemplate;if("root"!=box){const split="left"==dir||"right"==dir?splitColumn:splitRow,{left,right,top,bottom}=getBounds(gridTemplate,box),first="left"==dir||"right"==dir?left:top,last="left"==dir||"right"==dir?right:bottom,{rows,columns,areas}=(last-first)%2==0?split(gridTemplate,first+(last-first)/2):gridTemplate,midpoint=Math.ceil((first+last+((last-first)%2==0?1:0))/2);cb({rows,columns,areas:areas.map(((data,row)=>data.map(((v,col)=>{const bound="left"==dir||"right"==dir?col:row;return v==id?".":"left"==dir||"top"==dir?v==box&&bound<midpoint?id:v:"right"==dir||"bottom"==dir?v==box&&bound>=midpoint?id:v:void 0}))))})}else{const{rows,columns,areas}=gridTemplate,bounds=getBounds(gridTemplate,id),newSize="right"==dir||"left"==dir?1+bounds.right-bounds.left:1+bounds.bottom-bounds.top,newAreas=areas.map((data=>data.map((v=>v==id?".":v))));"top"==dir||"bottom"==dir?cb(insertRow({rows,columns,areas:newAreas},"top"==dir?0:rows.length,newSize,{fill:columns.map((_v=>id)),resize:!0})):"left"!=dir&&"right"!=dir||cb(insertColumn({rows,columns,areas:newAreas},"left"==dir?0:columns.length,newSize,{fill:id,resize:!0}))}}),[gridTemplate,temporaryGridTemplate]),[,borderDrop]=(0,useDrop.L)((()=>({accept:"mirador.handle",drop(item,monitor){resizeWindow(item,monitor.getDifferenceFromInitialOffset(),!0)},hover(item,monitor){monitor.canDrop()&&resizeWindow(item,monitor.getDifferenceFromInitialOffset(),!1)}})),[resizeWindow,width,height]),[{isOver},windowDrop]=(0,useDrop.L)((()=>({accept:"mirador.window",drop(item,monitor){monitor.getDropResult()?moveWindow(item,monitor.getDropResult(),!0):setTemporaryGridTemplate(null)},hover({id},monitor){const newAreas=gridTemplate.areas.map((row=>row.map(((v,i)=>v==id?".":v))));setTemporaryGridTemplate(cleanupGrid({...gridTemplate,areas:newAreas}))},collect:monitor=>({isOver:monitor.isOver()})})),[moveWindow,setTemporaryGridTemplate,gridTemplate]),onDropFailed=(0,react.useCallback)((()=>{setTemporaryGridTemplate(null)}),[setTemporaryGridTemplate]);return(0,react.useLayoutEffect)((()=>{ref.current&&(setWidth(ref.current.getBoundingClientRect().width),setHeight(ref.current.getBoundingClientRect().height))}),[]),(0,jsx_runtime.jsxs)("div",{ref:mergeRefs(ref,windowDrop,borderDrop),style:gridStyle,...props,children:[(0,jsx_runtime.jsx)(components_DropTarget,{isOver,box:"root",size:"25px"}),react.Children.map(children,(child=>(0,jsx_runtime.jsx)(components_Tile,{id:child.props.id,onDropFailed,children:child})))]})};Container.displayName="Container";const Grid=({children,...props})=>(0,jsx_runtime.jsx)(dist.WG,{options:rdndmb_html5_to_touch_dist.r,...props.dragAndDropManager&&{manager:props.dragAndDropManager},children:(0,jsx_runtime.jsx)(Container,{...props,children})});Grid.displayName="Grid",Grid.__docgenInfo={description:"",methods:[],displayName:"Grid"};const components_Grid=Grid,Grid_stories={title:"Grid",component:components_Grid},Window=({children,dragHandle,style,...props})=>(0,jsx_runtime.jsxs)("div",{...props,style:{height:"100%",border:"1px solid rgba(0,0,0,0.3)",...style},children:[(0,jsx_runtime.jsx)("div",{ref:dragHandle,style:{backgroundColor:"rgba(0,0,0,0.3)",cursor:"pointer"},children:"Drag handle"}),children]});Window.displayName="Window";const OneUp=()=>(0,jsx_runtime.jsx)(components_Grid,{children:(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"})});OneUp.displayName="OneUp";const TwoUp=()=>(0,jsx_runtime.jsxs)(components_Grid,{children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"})]});TwoUp.displayName="TwoUp";const ThreeUp=()=>(0,jsx_runtime.jsxs)(components_Grid,{children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"}),(0,jsx_runtime.jsx)(Window,{id:"c",children:"C"})]});ThreeUp.displayName="ThreeUp";const InitialGrid=()=>(0,jsx_runtime.jsxs)(components_Grid,{initialLayout:{rows:[1,1],columns:[1,1],areas:[["a","a"],["b","c"]]},children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"}),(0,jsx_runtime.jsx)(Window,{id:"c",children:"C"})]});InitialGrid.displayName="InitialGrid";const ComplexGrid=()=>(0,jsx_runtime.jsxs)(components_Grid,{initialLayout:{rows:[1,1,1,1],columns:[1,1,1,1,1],areas:[["a","a","a","a","a"],["d","c","f","f","f"],["d","c","f","f","f"],["d","b","e","e","e"]]},children:[(0,jsx_runtime.jsx)(Window,{id:"a",children:"A"}),(0,jsx_runtime.jsx)(Window,{id:"b",children:"B"}),(0,jsx_runtime.jsx)(Window,{id:"c",children:"C"}),(0,jsx_runtime.jsx)(Window,{id:"d",children:"D"}),(0,jsx_runtime.jsx)(Window,{id:"e",children:"E"}),(0,jsx_runtime.jsx)(Window,{id:"f",children:"F"})]});ComplexGrid.displayName="ComplexGrid",OneUp.parameters={...OneUp.parameters,docs:{...OneUp.parameters?.docs,source:{originalSource:'() => <Grid><Window id="a">A</Window></Grid>',...OneUp.parameters?.docs?.source}}},TwoUp.parameters={...TwoUp.parameters,docs:{...TwoUp.parameters?.docs,source:{originalSource:'() => <Grid><Window id="a">A</Window><Window id="b">B</Window></Grid>',...TwoUp.parameters?.docs?.source}}},ThreeUp.parameters={...ThreeUp.parameters,docs:{...ThreeUp.parameters?.docs,source:{originalSource:'() => <Grid><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>',...ThreeUp.parameters?.docs?.source}}},InitialGrid.parameters={...InitialGrid.parameters,docs:{...InitialGrid.parameters?.docs,source:{originalSource:'() => <Grid initialLayout={{\n  rows: [1, 1],\n  columns: [1, 1],\n  areas: [["a", "a"], ["b", "c"]]\n}}><Window id="a">A</Window><Window id="b">B</Window><Window id="c">C</Window></Grid>',...InitialGrid.parameters?.docs?.source}}},ComplexGrid.parameters={...ComplexGrid.parameters,docs:{...ComplexGrid.parameters?.docs,source:{originalSource:'() => <Grid initialLayout={{\n  rows: [1, 1, 1, 1],\n  columns: [1, 1, 1, 1, 1],\n  areas: [["a", "a", "a", "a", "a"], ["d", "c", "f", "f", "f"], ["d", "c", "f", "f", "f"], ["d", "b", "e", "e", "e"]]\n}}>\n    <Window id="a">A</Window>\n    <Window id="b">B</Window>\n    <Window id="c">C</Window>\n    <Window id="d">D</Window>\n    <Window id="e">E</Window>\n    <Window id="f">F</Window>\n  </Grid>',...ComplexGrid.parameters?.docs?.source}}};const __namedExportsOrder=["OneUp","TwoUp","ThreeUp","InitialGrid","ComplexGrid"];OneUp.__docgenInfo={description:"",methods:[],displayName:"OneUp"},TwoUp.__docgenInfo={description:"",methods:[],displayName:"TwoUp"},ThreeUp.__docgenInfo={description:"",methods:[],displayName:"ThreeUp"},InitialGrid.__docgenInfo={description:"",methods:[],displayName:"InitialGrid"},ComplexGrid.__docgenInfo={description:"",methods:[],displayName:"ComplexGrid"}}}]);