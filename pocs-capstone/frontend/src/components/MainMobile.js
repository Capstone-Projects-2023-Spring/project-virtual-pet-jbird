import PetDisplayMobile from "./PetDisplay/PetDisplayMobile"
import { useState, useContext, useRef } from "react";
import "./MainMobile.css";
import GlobalContext from "../context/GlobalContext.js";
import InventoryBoxMobile from "./Inventory/InventoryBoxMobile.js";
import PetProfPage from "./PageDisplay/PetProfPage.js";
import CalendarPageMobile from "./CalendarMobile/CalendarPageMobile.js";
import TaskPageMobile from "./PageDisplay/TaskMobile/TaskPageMobile.js";
import tasks from "../images/tabs/tasks.png";
import calendar from "../images/tabs/calendar.png";
import profile from "../images/tabs/profile.png";
import inventory from "../images/tabs/inventory.png";


const MainMobile = () => {
  const handlers = useContext(GlobalContext);
  const tabs = ['T', 'C', 'I', 'P'];
  const [activeTab, setActiveTab] = useState(0);


    return (
      <GlobalContext.Provider value={handlers}>
        <div className="container-m" width={handlers?.width}>
            <div className="top-container-mobile">
            <PetDisplayMobile value={handlers}/>
            </div>

            <div className="bottom-container-mobile">
            
            {activeTab === 0 && <TaskPageMobile/>}
            {activeTab === 1 && <CalendarPageMobile/> }
            {activeTab === 2 && <InventoryBoxMobile/>}
            {activeTab === 3 && <PetProfPage/>}
        
            </div>

          <div className="tab-container">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`tab ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)} >
                {tab}
              </div>
            ))}
        </div>
      </div>
      </GlobalContext.Provider>
    );
};

export default MainMobile;