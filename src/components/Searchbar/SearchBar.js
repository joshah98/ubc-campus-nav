import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "./searchbar.css";
import { Button } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { IoIosArrowRoundBack } from "react-icons/io";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import Draggable from 'react-draggable';


export const SearchBar = props => {
    const [courses, setCourses] = useState([]);
    const [codeText, setCourseText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const dropdownLen = 15;

    const containerStyle = {
        position:'fixed',
        top: '25%',
        left: '10%',
        zIndex: '10',
        display: 'inline-block',
        transition: 'height 0.2s linear',
        width: '300px',
        height: '155px',
        height: `${error && suggestions.length === 0 ? '155px' : (page === 1 ? `${25*suggestions.length + 100}px` : '305px')}`,
        padding: '12px',
        backgroundColor: '#002145',
        overflow: 'hidden'
    }
    
    useEffect(() => {
        const loadCourses = async() => {
            axios.get('https://ubcapi.herokuapp.com/courses/codes')
             .then((res) => {
                 setCourses(res.data);
                 setLoading(false);
                 console.log("data loaded");
             });
        }
        loadCourses();
    }, []);

    const onSuggestHandler = (text) => {
        let courseCode = text.replace(/\s/g, '');
        setCourse(courseCode);
        setCourseText(text);
        setSuggestions([]);

        // Find all the sections for the selected course
        axios.get(`https://ubcapi.herokuapp.com/courses/${courseCode}/sections`)
        .then((result) => {
            if (result.data.length > 0) {
                setSections(result.data);
                setError(false);
                setPage(2);
            } else {
                setSections([]);
                setError(true);
            }

        })
        .catch((err) => {
            setSections([]);
            console.log(err);
            setError(true);
        });
    };
    
    const courseMatches = (text) => {
        let matches = []
        
        if (text.length > 0) {
            matches = courses.filter(item => {
                const regex = new RegExp(`^${text}`, "gi");
                return item.match(regex);
            })
        }
        if (matches.length > 0) {
            setError(false);
        }
        setSuggestions(matches.slice(0,dropdownLen));
        setCourseText(text);
    };
    
    const selectSection = (section) => {
        setSection(section);
    };

    return (
        <Draggable>
            <div className='container1' style={containerStyle}>
                {loading &&
                    <LoadingMask className="load" loading={true} text={"loading..."}>
                    </LoadingMask>
                }

                <Slide direction="left" in={page === 1 && !loading} timeout={{enter:300, exit:0}} mountOnEnter unmountOnExit>
                    <div>
                        <form onSubmit={(event) => {
                            onSuggestHandler(codeText); 
                            event.preventDefault();}
                            }>
                            <input
                                className="input"
                                type='text' 
                                onChange={e => courseMatches(e.target.value)}
                                value={codeText}
                                onBlur={() => {
                                    setTimeout(() => {setSuggestions([])}, 100);
                                }}
                                />
                            <button type="submit" className="button findSections">Find Sections</button>
                        </form>
                        {error &&
                            <h1 className='error'>This course code is either invalid or doesn't exist</h1>
                        }
                        <div>
                            {suggestions && suggestions.map((suggestion, i) => 
                                <div className='dropdown' key={i} onMouseDown={(e) => e.preventDefault()} onClick={() => {onSuggestHandler(suggestion);}}>{suggestion}</div>
                                )}
                        </div>
                    </div>
                </ Slide>        
                    


                <Slide direction="right" in={page === 2 && !loading} mountOnEnter unmountOnExit>
                    <div>
                        <IoIosArrowRoundBack className="back" onClick={() => setPage(1)}/>
                        <form onSubmit={(event) => {
                                event.preventDefault();
                                props.newPin(course, section);
                            }
                        }>
                            {sections.length > 0 &&
                                <>            
                                    <div className='sections'>
                                        {sections.map((sec, i) => 
                                            <div className='section' key={i} tabIndex={`${i}`} onClick={() => {selectSection(sec)}}>{sec}</div>
                                        )}
                                    </div>
                                    <button type="submit" value="Add Course" className="button addCourse">Add Course to Map!</button>
                                </>
                            }
                        </form>
                    </div>
                </ Slide>
                

                

                
            </div>
        </Draggable>
    )
};
