import axios from "axios";
import useAccessToken from "../hook/useAccessToken";

const useFetchData = () => { // No need to pass parameters here
    const accessToken = useAccessToken();

    return async (apiUrl, dataValues = {}) => { // Return an async function
        const configurations = {
            method: 'get',
            url: apiUrl,
            data: dataValues,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        };

        try {
            return await axios.get(apiUrl, configurations); // Make the request using axios.get directly
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Throw the error to be caught by the caller
        }
    };
};

const useSendDeleteData = () => {
    const accessToken = useAccessToken();
    return async (apiUrl, dataValues = {}) => {
        const configurations = {
            method: 'delete',
            url: apiUrl,
            data: dataValues,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        };

        try {
            return await axios.delete(apiUrl, configurations); // Make the request using axios.get directly
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Throw the error to be caught by the caller
        }
    }
}


const useSendPutData = () => { // No need to pass parameters here
    const accessToken = useAccessToken();

    return async (apiUrl, dataValues = {}) => { // Return an async function
        const configurations = {
            method: 'put',
            url: apiUrl,
            data: dataValues,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        };

        try {
            return await axios.put(apiUrl, configurations); // Make the request using axios.get directly
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Throw the error to be caught by the caller
        }
    };
};

const useExportFiles = () => {
    const accessToken = useAccessToken();

    return async (apiUrl, dataValues = {}, format) => { // Return an async function
        const configurations = {
            method: 'get',
            url: apiUrl,
            data: dataValues,
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        };

        try {

            const response = await axios.get(apiUrl, configurations); // Make the request using axios.get directly
              // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;

            // Set the filename for the download
            link.setAttribute('download', `data.${format === 'excel' ? 'xlsx' : 'pdf'}`);

            // Append the link to the document body
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Cleanup: Remove the link and revoke the URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Throw the error to be caught by the caller
        }
    };
}

export { useFetchData, useSendDeleteData, useExportFiles };
