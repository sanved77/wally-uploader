import { useEffect, useState } from "react";
import "../App.css";
import axios from 'axios';
import _ from 'lodash';

const Categorizer = (props) => {
    const [set, setSet] = useState(() => new Set());
    const [payload, buildPayload] = useState(
        props.links.map((ln) => {
            let temp = {};
            temp.link = ln + "";
            temp.keywords = "";
            temp.downloads = 0;
            temp.category = "";
            temp.subCategory = "";
            return temp;
        })
    );
    const [idx, setIdx] = useState(0);
    const [keyword, setKeywords] = useState("");
    const [apiKeywords, setApiKeywords] = useState([]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [modalView, setModalView] = useState(false);
    const [submitBtn, setSubmitBtn] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [categoryList, addToCategoryList] = useState([]);
    const [subCategoryList, addToSubCategoryList] = useState([]);
    const [keywordList, addToKeywordList] = useState([]);
    const [uploadDone, setUploadDone] = useState(false);
    const [headerFlicker, incHeaderFlicker] = useState(0);

    useEffect(() => {
        if (set.size === props.links.length) setSubmitBtn(true);
    }, [set]);

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
        document.getElementById("subCategory").value = "";
    };

    const saveMeta = () => {
        if (category === "" || subCategory === "") {

            setErrorMsg(true);
            return;
        }
        setErrorMsg(false);
        setSet((prev) => new Set(prev).add(idx));
        const tempPayload = JSON.parse(JSON.stringify(payload));
        tempPayload[idx].keywords = keyword;
        tempPayload[idx].category = category;
        tempPayload[idx].subCategory = subCategory;
        buildPayload(tempPayload);

        if (!categoryList.includes(category)) {
            addToCategoryList([...categoryList, category]);
        }
        if (!subCategoryList.includes(subCategory)) {
            addToSubCategoryList([...subCategoryList, subCategory]);
        }
        
        const keywordArr = keyword.split(",").filter(k => !keywordList.includes(k) && k !== "").map(k => k.trim());
        if (!keywordList.includes(keyword)) {
            addToKeywordList([...keywordList, ...keywordArr]);
        }
        setKeywords("");
        setCategory("");
        setSubCategory("");
        resetInput();
        putNext();
    };

    const setKeywordsListener = (e) => {
        setKeywords(e.target.value);
    };

    const setCategoryListener = (e) => {
        setCategory(e.target.value);
    };

    const setSubCategoryListener = (e) => {
        setSubCategory(e.target.value);
    };

    const toggleModal = () => {
        setModalView(!modalView);
    };

    const uploadPics = () => {

        // const tempPayload = JSON.parse(JSON.stringify(payload));
        const tempPayload = _.cloneDeep(payload);
        for (let i = 0; i < tempPayload.length; i++) {
            let prevVal = tempPayload[i].keywords ? tempPayload[i].keywords + ',' : '';
            tempPayload[i].keywords = prevVal + apiKeywords[i];
        }
        console.log(payload);
        buildPayload(tempPayload);

        axios.post(`http://nagdibai.xyz/wally-api/${props.colName}/upload`, { tempPayload })
        .then(res => {
            console.log(res.data);
            setUploadDone(true);
            setModalView(true);
        }).catch(e => console.log(e));

    };

    const putCategory = (e) => {
        setCategory(e.target.innerText);
        document.getElementById("category").value = e.target.innerText;
    }

    const putSubCategory = (e) => {
        setSubCategory(e.target.innerText);
        document.getElementById("subCategory").value = e.target.innerText;
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

            let headers = [
                {'Authorization': 'Basic a1FHYUhseE1sQTNQM3JLTk9hRmNNMGY1OmlVcjUyU0NiUW00NWROaUJnSklMZDlZVUhwWGhyWnlNclBERzkzNmxVVjZQbnpWRA=='},
                {'Authorization': 'Basic MHdyZzBOM1p4UVZWbG9EZDdVcXRZRnI1OjBxVGdEVmIzMU12UlR3dWswUlR4Zzc4VzNMV0FFZjNUakpYQ1BzazluU0ZidjRKVQ=='},
                {'Authorization': 'Basic NVZuNmEweG04YUx2MHpZMEpuNTMzQmN5OnR2ZHBxbzJyWUJYcE5EdWZ1WEJBVmRxOGVFUVVBR0wwWkJjVFlHc3dVT3NPYXdLUA=='}
            ];

            let config = {
                method: 'get',
                url: `https://api.everypixel.com/v1/keywords?url=${payload[index].link}&num_keywords=10`,
                headers: {}
            };
            console.log("Header used - " + JSON.stringify(headers[headerFlicker % headers.length]));
            config.headers = headers[headerFlicker % headers.length];
            incHeaderFlicker(prev => prev+1);

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                const keywordList = response.data["keywords"]
                    .map( ele => ele["keyword"])
                    .reduce((prev, curr) => prev + ',' + curr);
    
                const tempApiKeywords = [...apiKeywords];
                tempApiKeywords[index] = keywordList;
                setApiKeywords(tempApiKeywords);
            })
            .catch(function (error) {
                console.log(error);
            });
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
                        <span>SubCategory - {payload[idx].subCategory}</span>
                        <input
                            id="subCategory"
                            type="text"
                            onChange={setSubCategoryListener}
                            placeholder="sub category"
                            name="sub-category"
                        />
                    </div>
                    {
                        subCategoryList.map((item,i) => <p onClick={putSubCategory} className="subcategory-bubble category-bubble" value={item} key={i}>{item}</p>)
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
