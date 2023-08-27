import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import './style.css';

const TableComponent = () => {
    const [data, setData] = useState([]);
    const originalDataRef = useRef([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
                originalDataRef.current = response.data;
                setData(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const handlePriceChange = (item, value) => {
        setData(prevData => {
            const updatedData = prevData.map(dataItem =>
                dataItem._id === item._id ? { ...dataItem, price: value } : dataItem
            );
            return updatedData;
        });
    };
    const handleSavePrice = async (item) => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/product/${item._id}`,
                { price: item.price }
            );
            console.log('Price saved:', response.data);
        } catch (error) {
            console.error('Error saving price:', error);
        }
    };
    const handleResetPrice = (row) => {
        setData(prevData => {
          const originalPrice = originalDataRef.current.find(item => item._id === row.original._id)?.price || 0;
          const updatedData = prevData.map(item =>
            item._id === row.original._id ? { ...item, price: originalPrice } : item
          );
          return updatedData;
        });
      };
      

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Image',
                accessor: 'image',
                Cell: row => <img src={row.value} alt={`Image for ${row.name}`} className="table-image-small" />,
            },
            {
                Header: 'Category',
                accessor: 'category',
            },
            {
                Header: 'Label',
                accessor: 'label',
            },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: row => {
                    return (
                        <div className="price-cell">
                            <input
                                type="number"
                                value={row.value}
                                onChange={e => handlePriceChange(row.row.original, e.target.value)}
                            />
                            <div className="button-group">

                                <button className="save-button" onClick={() => handleSavePrice(row.row.original)}>Save</button>
                                <button className="reset-button" onClick={() => handleResetPrice(row.row)}>Reset</button>
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
        ], [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <div>
            {data.length ? (
                <div>
                    <table {...getTableProps()} className="react-table">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default TableComponent;
