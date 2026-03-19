import { useEffect, useState } from "react";
import {CreatorDashboardData, type GetCreatorResponse } from "./CreatorDashboardService";
import MiniCard from "../../services/MiniCards";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import styles from "./creatorDashboard.module.css"
function CreatorDashboard(){

    const [creatorData, setCreatorData] = useState<GetCreatorResponse| null>(null);
    const [loading, setLoading] = useState(true);

    async function loadCreatorData(){
        setLoading(true);
        const result:any = await CreatorDashboardData();
        console.log(result);
        setCreatorData(result)
        setLoading(false)
    }

    useEffect(()=>{
        loadCreatorData();
    },[])

    if (!creatorData) return <p>Loading...</p>;
  if (loading) {
    return <p>Loading ...</p>;
  }
    return(
    <div className={styles.container}>
        <Sidebar menu={creatorMenu}/>
        <main className={styles.content}>
            <h3>{creatorData.userName}</h3>
            <MiniCard title="Events Created" value={creatorData.stats.eventsCreated}/>
            
            
        </main>
        </div>
    )
}

export default CreatorDashboard