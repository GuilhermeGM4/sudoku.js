export function Test(){
    // let initialBoard = [
    //     [
    //         [
    //             [null, null, null], //row 1
    //             [3, null, 4],       //row 2
    //             [null, 7, 9]        //row 3
    //         ],
    //         [
    //             [9, 1, null],       //row 1
    //             [6, 8, null],       //row 2
    //             [null, 5, null]     //row 3
    //         ],
    //         [
    //             [4, null, 7],       //row 1
    //             [null, 1, null],    //row 2
    //             [6, null, 3]        //row 3
    //         ]
    //     ],
    //     [
    //         [
    //             [9, null, 2],       //row 4
    //             [null, 1, 5],       //row 5
    //             [null, 3, null]     //row 6
    //         ],
    //         [
    //             [null, null, null],
    //             [null, null, 6],
    //             [null, 9, null]
    //         ],
    //         [
    //             [8, null, 1],
    //             [3, 4, null],
    //             [null, 5, null]
    //         ]
    //     ],
    //     [
    //         [
    //             [2, null, null],    //row 7
    //             [null, null, 3],    //row 8
    //             [6, null, null]     //row 9
    //         ],
    //         [
    //             [5, 3, null],
    //             [1, null, null],
    //             [4, 7, null]
    //         ],
    //         [
    //             [7, null, null],
    //             [null, 9, null],
    //             [1, 3, null]
    //         ]
    //     ]
    // ];
    return (
        <>
            <h1>Test</h1>
            {/* <table border="1" style={{ borderCollapse: 'collapse', margin: 'auto' }}>
                <tbody>
                    {initialBoard.map((boardSection, sectionIndex) => (
                        <React.Fragment key={sectionIndex}>
                            {boardSection.map((rowGroup, rowIndex) => (
                                <tr key={`${sectionIndex}-${rowIndex}`}>
                                    {rowGroup.map((cellGroup, cellIndex) => (
                                        <React.Fragment key={`${sectionIndex}-${rowIndex}-${cellIndex}`}>
                                            {cellGroup.map((cell, index) => (
                                                <td key={`${sectionIndex}-${rowIndex}-${cellIndex}-${index}`} style={{ padding: '10px', textAlign: 'center' }}>
                                                    {cell !== null ? cell : ''}
                                                </td>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table> */}
        </>
    );
}

export default Test;