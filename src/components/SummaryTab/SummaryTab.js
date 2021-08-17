import React, {useState} from 'react';
import './SummaryTab.css';
import Slide from '@material-ui/core/Slide';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';

const SummaryTab = props => {
    const [toggle, setToggle] = useState(false);

    const changeToggle = () => {
        setToggle(!toggle);
    }

    return (
        <div className="container">   
            <Slide direction="left" in={toggle} mountOnEnter unmountOnExit>
                <div className="summaryTab">
                    {props.courses.map((course, i) =>
                        <div key={i}>
                            <div className="course name">
                                {course.course} {course.section} from {course.start} to {course.end}

                            </div>
                            {/* <div className="course time">{course.start} - {course.end}</div> */}
                            <div className="course remove" onClick={() => props.remove(course)}>Remove course</div>    
                        </div> 
                    )}
                    <div className="toggleoff" onClick={() => changeToggle()}>
                        <AiOutlineArrowRight className="arrow"/>
                    </div>

                </div>
            </Slide>
                 

            <Slide direction="left" in={!toggle} mountOnEnter unmountOnExit>
                <div className="toggleon" onClick={() => changeToggle()}>
                    <AiOutlineArrowLeft className="arrow"/>
                </div>
            </Slide>            

        </div>
    )
}

export default SummaryTab
