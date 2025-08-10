import React from 'react';
import {SyncLoader} from "react-spinners";

const Loading = () => {
    return (
        <div>
            <h4>잠시만 기다려주세요.</h4>
            <SyncLoader />
        </div>
    )

}

export default Loading;