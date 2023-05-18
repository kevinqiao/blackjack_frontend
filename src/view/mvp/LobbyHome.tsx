import { animate, motion, PanInfo, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { throttle } from 'lodash';
import TournamentList from "../component/lobby/TournamentList";
import { useNavManager} from "../../service/NavManager";


function LobbyHome() {
  const {preMenu,menu,change}=useNavManager();
  const x = useMotionValue(0)
  // const menuRef = useRef(2)
  const [width, setWidth]=useState(window.innerWidth);
  const [height, setheight] = useState(window.innerHeight);
  console.log("LobbyHome")
  useEffect(()=>{
    const duration= Math.abs(menu-preMenu)*0.4
    animate(x, (2-menu)*width, { duration:duration })
  },[menu])
  const changeMenu=(m:number)=>{
     change(m);
  }
  const handlePan = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const { offset } = info;
      if (offset.x > 0&&menu>0) {
        console.log("Panning to the right");
        change(menu-1)

      } else if(offset.x < 0&&menu<4) {
        console.log("Panning to the left");
        change(menu+1)
      }
  }

  return <>
  
  <motion.div layout key="slides" style={{x,position:"absolute",zIndex:200,top:0,left:0-2*width,display:"flex",width:5*width,height:height,overflowX:"hidden"}} >
    <motion.div layout key="slide1" style={{width:width,height:height,backgroundColor:"red"}} onPan={handlePan}></motion.div>
    <motion.div layout key="slide2" style={{width:width,height:height,backgroundColor:"yellow"}} onPan={handlePan}></motion.div>
    <motion.div layout key="slide3" style={{width:width,height:height,backgroundColor:"blue"}} onPan={handlePan}>
     
    </motion.div>
    <motion.div layout key="slide4" style={{width:width,height:height,backgroundColor:"green"}} onPan={handlePan}></motion.div>
    <div  key="slide5" style={{width:width,height:height,backgroundColor:"white"}}>

    <TournamentList/>
    </div>
  </motion.div>
   <div style={{position:'absolute',zIndex:600,display:"flex",justifyContent:"space-around",bottom:0,left:0,width:'100%',height:50}}>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:menu===0?"white":"blue",color:menu===0?"blue":"white",width:"20%"}} onClick={()=>changeMenu(0)}>menu1</div>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:menu===1?"white":"blue",color:menu===1?"blue":"white",width:"20%"}} onClick={()=>changeMenu(1)}>menu2</div>
     <div style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:menu===2?"white":"blue",color:menu===2?"blue":"white",width:"20%"}} onClick={()=>changeMenu(2)}>menu3</div> 
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:menu==3?"white":"blue",color:menu===3?"blue":"white",width:"20%"}} onClick={()=>changeMenu(3)}>menu4</div>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:menu===4?"white":"blue",color:menu===4?"blue":"white",width:"20%"}} onClick={()=>changeMenu(4)}>menu5</div>
  </div>
  <div style={{position:'absolute',zIndex:1700,display:"flex",justifyContent:"space-around",top:0,left:0,width:'100%',height:90,backgroundColor:"yellow"}}></div>
  </>;
}

export default LobbyHome;
