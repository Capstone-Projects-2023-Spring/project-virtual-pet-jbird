import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "./PetDisplay.css";
import "../Inventory/Inventory.css";
import orange_H_gif from "../../images/orange_happy_gif.gif";
import orange_S_gif from "../../images/orange_sad_gif.gif";
import gray_H_gif from "../../images/gray_happy_gif.gif";
import gray_S_gif from "../../images/gray_sad_gif.gif";
import gray_cat from "../../images/gray_neutral_scaled_5x_pngcrushed.png";
import orange_cat from "../../images/orange_neutral_scaled_5x_pngcrushed.png";
import white_cat from "../../images/whitecat_scaled_5x_pngcrushed.png";
import tux_cat from "../../images/tux_cat_scaled_5x_pngcrushed.png";
import white_H_gif from "../../images/white_happy_gif.gif";
import white_S_gif from "../../images/white_sad_gif.gif";
import tux_H_gif from "../../images/tux_happy_gif.gif";
import tux_S_gif from "../../images/tux_sad_gif.gif";
import gray_N_prop from "../../images/propeller_hat.gif";
import gray_H_prop from "../../images/prop_happy.gif";
import gray_S_prop from "../../images/prop_sad.gif";
import dingSound from "../../audio/dingsound.mp3";

import { useContext, useEffect, useRef, useState } from "react";

import bgimage from "../../images/bg.gif";
import ProgressBar from "react-bootstrap/ProgressBar";
import orange_click from "../../images/orange_cat_hi_scaled_5x_pngcrushed.png";
import gray_click from "../../images/gray_cat_hi_scaled_5x_pngcrushed.png";
import white_click from "../../images/white_cat_hi_scaled_5x_pngcrushed.png";
import tux_click from "../../images/tux_cat_hi_scaled_5x_pngcrushed.png";
import pet_rock from "../../images/pet_rock_scaled_5x_pngcrushed.png"
import CalculatePetLevel from "../../algos/calculatePetLevel";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import GlobalContext from "../../context/GlobalContext.js";
// (next level - remainder) / (next level) //

const SAD = "S";
const NEUTRAL = "N";
const HAPPY = "H";

const TASK_URL = "/tasks/";
const USER_URL = "/user-data/";
var YESTERDAY = new Date(Date.now() - 86400000);
var TODAY = new Date();
YESTERDAY = new Date(
  YESTERDAY.toLocaleString("en-US", { timeZone: "America/New_York" }).split(
    ","
  )[0]
);
TODAY = new Date(
  TODAY.toLocaleString("en-US", { timeZone: "America/New_York" }).split(",")[0]
);

const WEIGHTS = [
  "15 paperclips",
  "3 nickels",
  "5 pieces of bubblegum",
  "4 mullberries",
  "2/3 of a medium radish",
  "461 sequins",
  "25 miniature toadstools",
  "5 acorns",
  "1 small egg",
  "231.5 grains of rice",
  "6 teaspoonfuls of cinnamon",
  "272 apple seeds",
  "1/17 of a grapefruit",
  "8 cups of rose petals",
  "2 tiny gray pebbles",
  "12 jellybeans",
  "1 strawberry",
  "3 sheets of US letter sized printer paper",
  "300 almond slivers",
  "3/4 of a slice of multigrain bread",
  "1 big handful of cotton balls",
  "4 clementine slices",
  "150 wooden toothpicks",
  "1 large thimble",
  "3 wooden pencils",
];

const PetDisplay = () => {
  //TODO - shouldn't call calc-pet-lev 3 times
  const [click, setClick] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [mood, setMood] = useState(NEUTRAL); //H = happy, S = Sad, N = Neutral
  const [mooddesc, setMoodDesc] = useState("");
  const [avatarImage, setAvatarImage] = useState(null);
  //const avatar_handler = useContext(AvatarContext);
  const contextHandler = useContext(GlobalContext);
  const [spritesheetInstance, setSpritesheetInstance] = useState(null);
  //const [exp, setExp] = useState(avatar_handler.avatarInfo.total_xp);
  const [level, setLevel] = useState(
    CalculatePetLevel(contextHandler?.avatarInfo.total_xp).LEVEL
  );
  //const [remainder, setRemainder] = useState(CalculatePetLevel(avatar_handler.avatarInfo.total_xp).REMAINDER);
  //const [next_level, setNextLevel] = useState(CalculatePetLevel(avatar_handler.avatarInfo.total_xp).REMAINDER);
  const [level_info, setLevelInfo] = useState(
    CalculatePetLevel(contextHandler?.avatarInfo.total_xp)
  );
  // const [ratio,setRatio] = useState(level_info.NEXT_LEVEL-level_info.REMAINDER/level_info.NEXT_LEVEL ) //TODO susss

  const [progressNow, setProgressNow] = useState(0);
  const levelUpAudio = new Audio(dingSound);

  //var pet = contextHandler?.avatarInfo;
  function animateSpriteSheet() {
    if (contextHandler?.spritesheetInstance) {
      contextHandler?.spritesheetInstance.goToAndPlay(1);
      contextHandler?.spritesheetInstance.pause();
    }
  }

  function handleGetInstance(spritesheet) {
    contextHandler?.setSpritesheetInstance(spritesheet);
  }

  const handleClick = () => {
    setClick(true);
    switch (contextHandler?.avatarInfo.avatar_type) {
      case "CT":
        // console.log(pet.palette);
        switch (contextHandler?.avatarInfo.palette) {
          case 0:
            setAvatarImage(orange_click);
            break;
          case 1:
            setAvatarImage(gray_click);
            break;
          case 2:
            setAvatarImage(white_click);
            break;
          case 3:
            setAvatarImage(tux_click);
            break;
        }
    }
    setTimeout(() => {
      setAvatarImage(getavatarImage(contextHandler?.avatarInfo));
      console.log(getavatarImage(contextHandler?.avatarInfo));
    }, 1500);
    setClick(false);
  };

  function dateDelta(date1, date2) {
    return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
  }

  //We should calculate the pets modd on change of state
  /*
        if it's you're birthday, your pet is happy
        if pet hasn't been fed in a while but tasks are complete pet is neutral
        if pet tasks are overdue, pet is sad
    */

  useEffect(() => {
    var tasks;
    var user;
    var feed_flag = false;

    axiosPrivate.get(USER_URL).then((response) => {
      user = response?.data;
      const birthday = new Date(user?.birthday);
      //if it's your birthday, your pet is happy
      const birthday_delta = dateDelta(birthday, TODAY);
      if (birthday_delta < 1 && birthday_delta >= 0) {
        setMood(HAPPY);
        setMoodDesc("I'm so happy it's your birthday!! Yippee!!");
        console.log("BIRTHDAY HAPPY:", birthday_delta);
        return;
      }
    });

    const last_interaction = contextHandler.avatarInfo.last_interaction;
    var last_feed = new Date(contextHandler.avatarInfo.last_feed);
    last_feed = new Date(
      last_feed
        .toLocaleString("en-US", { timeZone: "America/New_York" })
        .split(",")[0]
    );

    const feed_delta = dateDelta(TODAY, last_feed); //elapsed time since last feed
    console.log("FEED DELTA", feed_delta, last_feed, TODAY);
    if (feed_delta <= 3 && feed_delta > 1) {
      setMood(NEUTRAL);
      setMoodDesc("I'm feeling content.");
      console.log("FEED NEUTRAL", feed_delta);
    } else if (feed_delta <= 1) {
      setMood(HAPPY);
      setMoodDesc("Candy is so yummy! I'm so happy!");
      console.log("FEED HAPPY", feed_delta);
    } else {
      setMood(SAD);
      setMoodDesc("I'm hungry :(");
      console.log("FEED SAD", feed_delta);
      feed_flag = true;
    }

    var pass_task_check = false;
    //if overdue assignments, pet is sad
    axiosPrivate.get(TASK_URL).then((response) => {
      tasks = response?.data;
      tasks.forEach((item) => {
        if (!item.completed) {
          const _due = item.due_date.split("-");
          console.log("_due----->", _due);

          var due = new Date(_due[0], Number(_due[1]) - 1, _due[2]);

          const task_delta = dateDelta(due, TODAY);

          console.log("ITEM DUE DATE:", item.due_date);
          console.log(
            "TASK DELTA----->",
            task_delta,
            item.due_date,
            TODAY,
            item.completed
          );
          if (task_delta < 0) {
            setMood(SAD);
            setMoodDesc(
              "I'm stressed. You have overdue tasks... please complete them :("
            );
            console.log("TASK SAD");
            return;
          }
        }
      });

      pass_task_check = true;
    });
    if (pass_task_check) {
      // guard because axios call is async
      if (feed_flag) {
        setMood(NEUTRAL);
        setMoodDesc("I'm feeling content.");
        console.log("TASK NEUTRAL");
        return;
      }
      setMood(HAPPY); //TODO we'll check grades here as well
      setMoodDesc("You've gotten so much done! I'm so happy! :D");
      console.log("TASK HAPPY");
      return;
    }
  }, [contextHandler]);

        const getavatarImage = (pet) => {
            switch (pet.avatar_type) {
                case 'CT':
                    console.log(pet.palette);
                    switch (pet.palette) {
                        case 0:
                            if (mood === 'N') {
                                setAvatarImage(orange_cat);
                                //} else {
                                //    setAvatarImage(`orange_${mood}_gif`)
                                // console.log(`orange_${mood}_gif`)
                            } else if (mood === 'H') {
                                setAvatarImage(orange_H_gif);
                            } else {
                                setAvatarImage(orange_S_gif);
                            }
                            return
                        case 1:
                            if(level_info.LEVEL >= 20){
                                if(mood==='N'){
                                    setAvatarImage(gray_N_prop);
                               } else if(mood==='H'){
                                    setAvatarImage(gray_H_prop);
                                    // setAvatarImage(`gray_${mood}_gif`)
                                    // console.log(`gray_${mood}_gif`)
                               } else {
                                setAvatarImage(gray_S_prop);
                               }
                               return
                            }
                            if(mood==='N'){
                                setAvatarImage(gray_cat);
                            } else if (mood === 'H') {
                                setAvatarImage(gray_H_gif);
                                // setAvatarImage(`gray_${mood}_gif`)
                                // console.log(`gray_${mood}_gif`)
                            } else {
                                setAvatarImage(gray_S_gif);
                            }
                            return
                        case 2:
                            if (mood === 'N') {
                                setAvatarImage(white_cat);
                            } else if (mood === 'H') {
                                setAvatarImage(white_H_gif);
                                // setAvatarImage(`gray_${mood}_gif`)
                                // console.log(`gray_${mood}_gif`)
                            } else {
                                setAvatarImage(white_S_gif);
                            }
                            return
                        case 3:
                            if (mood === 'N') {
                                setAvatarImage(tux_cat);
                            } else if (mood === 'H') {
                                setAvatarImage(tux_H_gif);
                                // setAvatarImage(`gray_${mood}_gif`)
                                // console.log(`gray_${mood}_gif`)
                            } else {
                                setAvatarImage(tux_S_gif);
                            }
                            return
                        case 4:
                          setAvatarImage(pet_rock);
                          return;
                        // case 2:
                        //     if(mood==='N'){
                        //         setAvatarImage(orange_cat);
                        //    //} else {
                        //     //    setAvatarImage(`orange_${mood}_gif`)
                        //        // console.log(`orange_${mood}_gif`)
                        //    } else if (mood === 'H'){
                        //         setAvatarImage(orange_H_gif);
                        //    } else {
                        //         setAvatarImage(orange_S_gif);
                        //    }

          // switch(mood){
          //         case 'N':
          //             setAvatarImage(gray_cat);
          //         case 'H':
          //             setAvatarImage(gray_H_gif);
          //         case 'S':
          //             setAvatarImage(gray_S_gif);
          //   //  }

          // CHANGE TO IMAGE OF OTHER CAT (black palette)
          // return require('../../images/graycat.png')
          // return graysheet;
        }


                case 'DG':
                    return ''
                case 'CR':
                    return ''
                case 'RK':
                    return ''
            }
        }
    //TEMP USE EFFECT TO SEE MOOD
    //Mary, plug in your state changes here!!
    useEffect(() => {
        console.log("MOOD------>", mood)
        
    getavatarImage(contextHandler?.avatarInfo);
  }, [mood, level_info.LEVEL]);

  const retAvatarImage = () => {
    return avatarImage;
  };

  useEffect(() => {
    setLevelInfo(CalculatePetLevel(contextHandler.avatarInfo?.total_xp));
    setProgressNow(level_info.RATIO);
  }, [contextHandler]);

  // Easter egg: randomly change pet's weight every minute (change the 60 to something else to change time interval
  const [currentWeight, setCurrentWeight] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WEIGHTS.length);
    return WEIGHTS[randomIndex];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * WEIGHTS.length);
      setCurrentWeight(WEIGHTS[randomIndex]);
    }, 5 * 60 * 1000); // change weight every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // useEffect to trigger 'level up' animation
  useEffect(() => {
    const prevLevel = contextHandler?.prev_level_info;
    if (prevLevel.LEVEL < level_info.LEVEL && contextHandler?.leveledUp) {
      // console.log("PREVIOUS LEVEL", contextHandler?.prev_level_info, "CURRENT LEVEL", level_info)

      // set the progress bar value to 100
      setProgressNow(100);

      // wait one second before transtioning to 0. CSS makes sure the transition to 0 isn't shown
      setTimeout(() => {
        // play level up audio
        levelUpAudio.play();

        // reset level to 0
        setProgressNow(0);

        // another set timeout for transtions
        setTimeout(() => {
          setProgressNow(level_info.RATIO);
          contextHandler?.setLeveledUp(false);
        }, 600);
      }, 1000);
    }
  }, [contextHandler]);

  // useEffect(() => {
  //     gainExpAudio.play()
  // }, [progressNow])

  return (
    <div className="pet-display">
      <Card style={{ width: "25rem" }}>
        <Card.Header
          style={{ fontSize: "calc(0.8vw + 1.4vh" }}
          className="pet-name"
        >
          {contextHandler?.avatarInfo.pet_name}
        </Card.Header>

        <div className="Board">
          <div className="p-sprite-display">
            <img src={bgimage} alt="background" className="bg-sprite" />
            <img
              src={avatarImage}
              className="p-sprite"
              onClick={handleClick}
            ></img>
          </div>
        </div>
        <div className="pbar-exp">
          <div className="pbar-text">LV.{level_info.LEVEL} </div>
          <ProgressBar
            now={progressNow}
            variant="success"
            style={{ width: "15rem" }}
          />
          <div className="experience-ratio">
            {level_info.NEXT_LEVEL - level_info.REMAINDER}/
            {level_info.NEXT_LEVEL}
          </div>
        </div>
        <Card.Body className="pd-bg">
          <Card.Text className="pet-desc-text">
            {contextHandler?.avatarInfo.flavour_text}
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="pd-position">
            <div className="pet-label">MOOD: </div>
            <div>{mooddesc}</div>
          </ListGroup.Item>
          <ListGroup.Item className="pd-position">
            <div className="pet-label">WEIGHT: </div>
            <div>{currentWeight}</div>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default PetDisplay;
