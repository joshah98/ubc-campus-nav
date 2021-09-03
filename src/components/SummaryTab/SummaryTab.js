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

        setPage(2);
    };

    return (
        <div className="container">   
            <Slide direction="left" in={toggle} timeout={{enter:300, exit:0}} mountOnEnter unmountOnExit>
                    <div className="summaryTab"> 
                        <Slide direction="right" in={page === 1} timeout={{enter:300, exit:0}} mountOnEnter unmountOnExit>
                            <div className="pageOne">
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
                            </div>
                        </Slide>

                        <Slide direction="left" in={page === 2} timeout={{enter:300, exit:0}} mountOnEnter unmountOnExit>
                            <div className="pageTwo">
                                <div onClick={() => setPage(1)}>
                                    <AiOutlineArrowLeft className="back"/>
                                </div>
                                <div className="locations">
                                    List of nearby study spots goes here ...
                                </div>

                            </div>
                        </Slide>
                        

                        <div className="toggleoff" onClick={() => changeToggle()}>
                            <AiOutlineArrowRight className="arrow"/>
                        </div>
                    </div>
            </Slide>
                 

            <Slide direction="left" in={!toggle} timeout={{enter:200, exit:0}} mountOnEnter unmountOnExit>
                <div className="toggleon" onClick={() => changeToggle()}>
                    <AiOutlineArrowLeft className="arrow"/>
                </div>
            </Slide>            

        </div>
    )
}

export default SummaryTab
