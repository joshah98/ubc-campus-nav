import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "./searchbar.css";

export const SearchBar = () => {
    const [courses, setCourses] = useState([]);
    const [codeText, setCourseText] = useState('');
    const [sectionText, setSectionText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [sectionSuggestions, setSectionSuggestions] = useState([]);
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
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
            setSections(result.data);
            console.log(result.data);
        })
        .catch((err) => console.log(err));
    };

    const onSectionSuggestHandler = (text) => {
        setSectionText(text);
        setSectionSuggestions([]);
        setSection(text);
    } 
    
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
    
    const sectionMatches = (text) => {
        let matches = []
        
        if (text.length > 0) {
            matches = sections.filter(item => {
                const regex = new RegExp(`^${text}`, "gi");
                return item.match(regex);
            })
        }
        setSectionSuggestions(matches);
        setSectionText(text);
    };

    return (
        <div className='container'>
            <input 
                className='codes'
                type='text' 
                onChange={e => courseMatches(e.target.value)}
                value={codeText}
                onBlur={() => {
                    setTimeout(() => {setSuggestions([])}, 100);
                }}
                />
            <ul>
                {suggestions && suggestions.map((suggestion, i) => 
                    <li className='dropdown' key={i} onMouseDown={(e) => e.preventDefault()} onClick={() => {onSuggestHandler(suggestion);}}>{suggestion}</li>
                    )}
            </ul>

            <input
                type='text'
                className='sections'
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
            </ul>
        </div>
    )
};
