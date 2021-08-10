import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "./searchbar.css";
import { Button } from '@material-ui/core';

export const SearchBar = props => {
    const [courses, setCourses] = useState([]);
    const [codeText, setCourseText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
    const [error, setError] = useState(false);
    const dropdownLen = 15;
    
    useEffect(() => {
        const loadCourses = async() => {
            axios.get('https://ubcapi.herokuapp.com/courses/codes')
             .then((res) => {
                 setCourses(res.data);
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
        setSuggestions(matches.slice(0,dropdownLen));
        setCourseText(text);
    };
    
    const selectSection = (section) => {
        setSection(section);
    };

    return (
        <div className='container'>
            <form onSubmit={(event) => {
                onSuggestHandler(codeText); 
                event.preventDefault();}
                }>
                <input
                    type='text' 
                    onChange={e => courseMatches(e.target.value)}
                    value={codeText}
                    onBlur={() => {
                        setTimeout(() => {setSuggestions([])}, 100);
                    }}
                />
                <input type="submit" value="Find sections"/>
            </form>
            {error &&
                <h1 className='error'>This course code is either invalid or doesn't exist</h1>
            }
            <ul>
                {suggestions && suggestions.map((suggestion, i) => 
                    <li className='dropdown' key={i} onMouseDown={(e) => e.preventDefault()} onClick={() => {onSuggestHandler(suggestion);}}>{suggestion}</li>
                    )}
            </ul>

            {/* <input
                type='text'
                onChange={e => sectionMatches(e.target.value)}
                value={sectionText}
                onBlur={() => {
                    setTimeout(() => {setSectionSuggestions([])}, 100);
                }}
            />
            <ul>
                {sectionSuggestions && sectionSuggestions.map((suggestion, i) => 
                    <li className='dropdown' key={i} onMouseDown={(e) => e.preventDefault()} onClick={() => {onSectionSuggestHandler(suggestion);}}>{suggestion}</li>
                )}
            </ul> */}
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
                    </>
                }
                <input type="submit" value="Add Course"/>
            </form>
            
        </div>
    )
};
