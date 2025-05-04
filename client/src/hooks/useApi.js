import useAxiosPrivate from './useAxiosPrivate';
import axios,{REQUESTS} from '../api/axios';

const useApi = () => {
    const axiosPrivate = useAxiosPrivate();

    // const putWordBank = async (data) => {
    //     try {
    //         const response = await axiosPrivate.post(url, data);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error posting data:', error);
    //         throw error;
    //     }
    // };

    const getWordBank = async () => {
        try {
            const response = await axiosPrivate.get(REQUESTS.GET_WORDS);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    const getWordMasteries = async () => {
        try {
            const response = await axiosPrivate.get(REQUESTS.GET_USER_MASTERIES);
            return response.data;
        } catch (error) {
            console.error('Error fetching user masteries:', error);
            throw error;
        }
    };

    const upsertMastery = async (wordId, mastery) => {
        try {
          const response = await axiosPrivate.post(REQUESTS.UPSERT_MASTERY, {
            wordId,
            mastery,
          });
          return response.data;
        } catch (error) {
          console.error('Error updating mastery:', error);
          throw error;
        }
      };
      


    return { getWordBank, getWordMasteries, upsertMastery };
};

export default useApi;