import React from 'react';

const UploadImg = () => {
    const handlePicture = (e) => {
        e.preventDefault();
    }
    return (
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Changer d'image</label>
            <input type="file" id="file" name="file" accept=".jpg, .jpeg, .png" />
        </form>
    );
};

export default UploadImg;