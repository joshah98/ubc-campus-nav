import React, {useState} from 'react';
import './SummaryTab.css';
import Slide from '@material-ui/core/Slide';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';

const SummaryTab = props => {
    const [toggle, setToggle] = useState(false);
    const [page, setPage] = useState(1);

    const changeToggle = () => {
        setToggle(!toggle);
    }

    const findNearby = (building) => {
        // Find all places near the building and switch to page 2
    };

    return (
        <div className="container">   
            <Slide direction="left" in={toggle} mountOnEnter unmountOnExit>
                <div className="summaryTab">
                    {props.courses.length === 0 && 
                        <div className="emptyText">
                            Nothin to see here yet...
                        </div>
                    }
                    {props.courses.map((course, i) =>
                        <div key={i}>
                            {course.show === true &&
                                <>                                
                                    <div className="course name">
                                        {course.course} {course.section} from {course.start} to {course.end}

                                    </div>
                                    <div className="course remove" onClick={() => props.remove(course)}>Remove Course</div>    
                                </>                            
                            }
                            {course.show === false &&
                                <div className="filler" onClick={() => findNearby(course.prevCourseBuilding)}>
                                    <div>
                                        Break from {course.start} to {course.end}
                                    </div>
                                    <div>
                                        Click for nearby study spots :D
                                    </div>
                                </div>
                            }
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
