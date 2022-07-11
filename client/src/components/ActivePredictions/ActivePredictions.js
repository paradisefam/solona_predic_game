import { useEffect, useState } from "react";
import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";
import CreateBetButton from "../CreateBetButton/CreateBetButton";

const ActivePredictions = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ predictions, setPredictions ] = useState([]);
    const { isAuthenticated } = useMoralis();

    const { fetch } = useMoralisCloudFunction(
        "getPredictions",
        { status: true },
        { autoFetch: false }
    );

    useEffect(() => {
        fetch({
            onSuccess: (result) => {
                setPredictions(result);
                setIsFetching(false);
            },
            onError: (error) => {
                console.log(error);
                setIsFetching(false);
            }
        });
    // eslint-disable-next-line
    }, []);

    if(isFetching) {
        return <div>Loading...</div>
    }
    
    return (
        <div>
            <h1>Active Predictions: {predictions.length}</h1>

            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Pair</Th>
                            <Th>Feed</Th>
                            <Th>Prediction</Th>
                            <Th>Deadline</Th>
                            <Th>Status</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            predictions.map(predictionData => {
                                const { id, attributes } = predictionData;
                                const { account, pair, prediction, predictionDeadline, status } = attributes;
                                return (
                                    <Tr key={id}>
                                        <Td>{id}</Td>
                                        <Td>{pair}</Td>
                                        <Td>{account}</Td>
                                        <Td>{prediction}</Td>
                                        <Td>{predictionDeadline.toString()}</Td>
                                        <Td>{status ? 'open' : 'closed'}</Td>
                                        {
                                            status && isAuthenticated && (
                                            <Td>
                                                <CreateBetButton 
                                                   predictionId={id}
                                                   status={status}
                                                />
                                            </Td>
                                            )
                                        }
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default ActivePredictions;