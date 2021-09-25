import { useEffect, useState } from "react";
import "../App.css";
import axios from 'axios';

// import EveryPixel from "../EveryPixel";

const Categorizer = (props) => {
    const [set, setSet] = useState(() => new Set());
    const [payload, buildPayload] = useState(
        props.links.map((ln) => {
            let temp = {};
            temp.link = ln + "";
            temp.keywords = "N/A";
            temp.downloads = 0;
            temp.category = "N/A";
            return temp;
        })
    );
    const [idx, setIdx] = useState(0);
    const [keyword, setKeywords] = useState("");
    const [apiKeywords, setApiKeywords] = useState([]);
    const [category, setCategory] = useState("");
    const [modalView, setModalView] = useState(false);
    const [submitBtn, setSubmitBtn] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [categoryList, addToCategoryList] = useState([]);
    const [keywordList, addToKeywordList] = useState([]);
    const [uploadDone, setUploadDone] = useState(false);

    useEffect(() => {
        console.log(set);
        if (set.size === props.links.length) setSubmitBtn(true);
    }, [set]);

    useEffect(() => {
        console.log(apiKeywords);
    }, [apiKeywords]);

    useEffect(() => {
        keywordAPI();
    }, [idx]);

    const putNext = () => {
        if (idx < props.links.length - 1) setIdx(idx + 1);
    };

    const putPrev = () => {
        if (idx > 0) setIdx(idx - 1);
    };

    const resetInput = () => {
        document.getElementById("keywords").value = "";
        document.getElementById("category").value = "";
    };

    const saveMeta = () => {
        if (keyword === "" || category === "") {
            setErrorMsg(true);
            return;
        }
        setErrorMsg(false);
        setSet((prev) => new Set(prev).add(idx));
        const tempPayload = JSON.parse(JSON.stringify(payload));
        tempPayload[idx].keywords = keyword;
        tempPayload[idx].category = category;
        buildPayload(tempPayload);
        if (!categoryList.includes(category)) {
            addToCategoryList([...categoryList, category]);
        }
        
        const keywordArr = keyword.split(",").filter(k => !keywordList.includes(k) && k !== "").map(k => k.trim());
        if (!keywordList.includes(keyword)) {
            addToKeywordList([...keywordList, ...keywordArr]);
        }
        setKeywords("");
        setCategory("");
        resetInput();
        putNext();
    };

    const setKeywordsListener = (e) => {
        setKeywords(e.target.value);
    };

    const setCategoryListener = (e) => {
        setCategory(e.target.value);
    };

    const toggleModal = () => {
        setModalView(!modalView);
    };

    const uploadPics = () => {

        const tempPayload = JSON.parse(JSON.stringify(payload));
        for (let i = 0; i < tempPayload.length; i++) {
            tempPayload[i].keywords = tempPayload[i].keywords + ',' + apiKeywords[i];
        }
        buildPayload(tempPayload);

        axios.post(`http://nagdibai.xyz/wally-api/${props.colName}/upload`, { payload })
        .then(res => {
            console.log(res);
            console.log(res.data);
            setUploadDone(true);
            setModalView(true);
        }).catch(e => console.log(e));

    };

    const putCategory = (e) => {
        setCategory(e.target.innerText);
        document.getElementById("category").value = e.target.innerText;
    }

    const putKeyword = (e) => {
        let newKeywordVal = '';

        newKeywordVal = document.getElementById("keywords").value === ""
        ? e.target.innerText
        : document.getElementById("keywords").value + "," + e.target.innerText;

        document.getElementById("keywords").value = newKeywordVal;
        setKeywords(newKeywordVal);
    }

    // For testing/documentation purpose
    const getPics = () => {
        axios.get(`http://nagdibai.xyz/wally-api/${props.colName}`)
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
    };

    const keywordAPI = (index = idx) => {

        if (!apiKeywords[index]) {
            let config = {
                method: 'get',
                url: `https://api.everypixel.com/v1/keywords?url=${payload[index].link}&num_keywords=10`,
                headers: { 
                    'Authorization': 'Basic MHdyZzBOM1p4UVZWbG9EZDdVcXRZRnI1OjBxVGdEVmIzMU12UlR3dWswUlR4Zzc4VzNMV0FFZjNUakpYQ1BzazluU0ZidjRKVQ=='
                }
            };

            const response = {"keywords":[{"keyword":"women","score":0.994975544791264},{"keyword":"beauty","score":0.9804824126708879},{"keyword":"one person","score":0.9495429289717471},{"keyword":"fashion","score":0.942619300386037},{"keyword":"caucasian ethnicity","score":0.9217276683115977},{"keyword":"portrait","score":0.9200523650091593},{"keyword":"close-up","score":0.8903242620265667},{"keyword":"young adult","score":0.8876327748998498},{"keyword":"adult","score":0.8672293618661057},{"keyword":"human face","score":0.8587813978098097}],"status":"ok"};

            console.log(JSON.stringify(response));
            const keywordList = response["keywords"]
                .map( ele => ele["keyword"])
                .reduce((prev, curr) => prev + ',' + curr);

            const tempApiKeywords = [...apiKeywords];
            tempApiKeywords[index] = keywordList;
            setApiKeywords(tempApiKeywords);

            // axios(config)
            // .then(function (response) {
            //     console.log(JSON.stringify(response.data));
            //     const keywordList = response.data["keywords"]
            //         .map( ele => ele["keyword"])
            //         .reduce((prev, curr) => prev + ' ' + curr);
    
            //     const tempApiKeywords = [...apiKeywords];
            //     tempApiKeywords[index] = keywordList;
            //     setApiKeywords(tempApiKeywords);
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
        }
    }

    return (
        <div className="CategorizerMain">
            {modalView && (
                <pre className="category-modal">
                    {uploadDone && <div className="upload-success">
                        Images uploaded
                    </div>}
                    <div onClick={toggleModal} className="close-btn">
                        CLOSE
                    </div>
                    {JSON.stringify(payload, null, 4)}
                </pre>
            )}
            {apiKeywords[idx] && <pre className="payload-peek">
                {JSON.stringify(apiKeywords[idx], null, 4)}
            </pre>}
            <div className="Categorizer">
                <div className="categorizer-form-div">
                    <div className="controller-buttons">
                        <span>Keywords - {payload[idx].keywords}</span>
                        <input
                            id="keywords"
                            type="text"
                            onChange={setKeywordsListener}
                            placeholder="keywords"
                            name="keywords"
                        />
                    </div>
                    {
                        keywordList.map((item,i) => <p onClick={putKeyword} className="category-bubble keyword-bubble" value={item} key={i}>{item}</p>)
                    }
                    <div className="controller-buttons">
                        <span>Category - {payload[idx].category}</span>
                        <input
                            id="category"
                            type="text"
                            onChange={setCategoryListener}
                            placeholder="category"
                            name="category"
                        />
                    </div>
                    {
                        categoryList.map((item,i) => <p onClick={putCategory} className="category-bubble" value={item} key={i}>{item}</p>)
                    }
                    <div className="controller-buttons">
                        <button
                            className="button button-info"
                            onClick={putPrev}
                            type="button"
                        >
                            Prev
                        </button>
                        <button
                            className="button button-info"
                            onClick={putNext}
                            type="button"
                        >
                            Next
                        </button>
                        <button
                            className="button button-save"
                            onClick={saveMeta}
                            type="button"
                        >
                            Save {'&'} Next
                        </button>
                    </div>
                    <div className="controller-buttons">
                        <button
                            className="button button-info"
                            onClick={toggleModal}
                            type="button"
                        >
                            Modal
                        </button>
                        <button
                            className="button button-info"
                            onClick={keywordAPI}
                            type="button"
                        >
                            API
                        </button>
                        {submitBtn && (
                            <button
                                className="button button-submit"
                                onClick={uploadPics}
                                type="button"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                    {errorMsg && <p className="error-msg">Please enter the info neatly</p>}
                </div>
                <div
                    style={{ backgroundImage: `url(${props.links[idx]})` }}
                    className="categorizer-image-window"
                ></div>
            </div>
        </div>
    );
};

export default Categorizer;
