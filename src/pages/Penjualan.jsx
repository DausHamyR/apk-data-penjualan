import React from 'react'
import http from '../helpers/http.helper'
import moment from 'moment'
import {BiSearch} from 'react-icons/bi'
import {BsFilterLeft} from 'react-icons/bs'
import { Formik } from 'formik'

function Penjualan() {
    const [allDataPenjualan, setAllDataPenjualan] = React.useState()
    const [allDataProduct, setAllDataProduct] = React.useState()
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState('Select Product');
    const [valuesProduct, setValuesProduct] = React.useState();
    const [messageSuccessCreatePenjualan, setMessageSuccessCreatePenjualan] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [searchByTanggal, setSearchByTanggal] = React.useState("");
    const [btnSearchTanggal, setBtnSearchTanggal] = React.useState(null);
    const [filter, setFilter] = React.useState(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const toggleFilter = () => {
        setFilter((prevState) => !prevState);
    };

    const doSearch = async (event) => {
        try{
            event.preventDefault()
            const {value: search} = event.target.search
            const body = new URLSearchParams({search}).toString()
            setSearch(body)
        }catch(err){
            console.log(err)
        }
    }

    const doSearchTanggal = async (event) => {
        try{
            console.log('masuk')
            event.preventDefault()
            const {value: searchPenjualan} = event.target.searchPenjualan
            console.log(searchPenjualan)
            const body = new URLSearchParams({searchPenjualan}).toString()
            console.log(body)
            setSearchByTanggal(body)
            setBtnSearchTanggal(null)
        }catch(err){
            console.log(err)
        }
    }

    React.useEffect(()=> {
        const getAllPenjualan = async() => {
            const {data} = await http().get(`/penjualan?${search}&${searchByTanggal}`)
            setAllDataPenjualan(data.results)
        }
        const getAllProduct = async() => {
            const {data} = await http().get(`/product`)
            // console.log(data)
            setAllDataProduct(data.results)
        }
        getAllPenjualan()
        getAllProduct()
    }, [allDataPenjualan, search, searchByTanggal])

    React.useEffect(()=> {
        if(messageSuccessCreatePenjualan){
            const timeout = setTimeout(() => {
                setMessageSuccessCreatePenjualan('');
                }, 3000);
                return () => clearTimeout(timeout);
        }
    }, [messageSuccessCreatePenjualan])

    const deleteDataPenjualan = async(id) => {
        const {data} = await http().delete(`/penjualan/${id}`)
    }

    const handleProduct = (option, id) => {
        setSelectedProduct(option);
        setIsDropdownOpen(false);
        setValuesProduct(id)
    };

    const btnCreateDataPenjualan = async values => {
        try {
            const body = new URLSearchParams({
                idProduct: valuesProduct,
                terjual: values.terjual,
            }).toString();
            const {data} = await http().post('/penjualan', body);
            setMessageSuccessCreatePenjualan(data.message)
            setSelectedProduct("Select Product")
        } catch (err) {
            console.log(err)
        }
    };

    const btnUpdateStokProduct = async values => {
        try {
            console.log(values)
            console.log(valuesProduct)
            const body = new URLSearchParams({
                stok: values.stok,
            }).toString();
            console.log(body)
            const {data} = await http().patch(`/penjualan/${valuesProduct}`, body);
            console.log(data)
            setMessageSuccessCreatePenjualan(data.message)
            setSelectedProduct("Select Product")
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div>
            <div className='flex items-center justify-center gap-6'>
                <form onSubmit={doSearch} className='flex justify-center items-center mt-12 max-w-[400px] w-[400px] relative'>
                    <input name='search' type="text" placeholder="Search Barang" className="input input-bordered w-full" />
                    <button type="submit" className='absolute right-4'>
                        <BiSearch size={40} className="text-slate-400"/>
                    </button>
                </form>
                <form onSubmit={doSearchTanggal} className='flex items-center mt-12 gap-2'>
                    <input name='searchPenjualan' onChange={()=>setBtnSearchTanggal(true)} type="date" placeholder='Input Price' className="input input-bordered w-full"/>
                    {btnSearchTanggal && 
                        <button type='submit' className='btn btn-primary'>Cari</button>
                    }
                </form>
            </div>
            <div className='flex justify-center items-center mt-6 gap-24'>
                <div className='flex justify-center gap-6'>
                    <label htmlFor="my_modal_6" className='text-center cursor-pointer bg-green-400 w-[70px] rounded-md text-white hover:bg-green-500'>Create</label>
                    <label htmlFor="modal_update_stok" className='text-center cursor-pointer bg-blue-400 w-[70px] rounded-md text-white hover:bg-blue-500'>Update</label>
                </div>
                {filter && <div>tes</div>}
                <button onClick={()=> toggleFilter()}>
                    <BsFilterLeft size={40} />
                </button>
            </div>
            <div className='flex justify-around mt-12'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='text-xl font-bold'>Stok Product</div>
                    <table className="table border-collapse table-fixed">
                        <thead>
                                <tr>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>No</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Nama Barang</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Stok</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Jenis Barang</th>
                                </tr>
                        </thead>
                        <tbody>
                            {allDataProduct?.map(data => (
                            <tr key={data.id}>
                                <td className='border-2 text-[#333]'>{data.id}</td>
                                <td className='border-2 text-[#333]'>{data.name}</td>
                                <td className='border-2 text-[#333]'>{data.stok}</td>
                                <td className='border-2 text-[#333]'>{data.jenisBarang}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <div className='text-xl font-bold'>Data Penjualan</div>
                    <table className="table border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>No</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Nama Barang</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Stok</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Jumlah Terjual</th> 
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Tanggal Transaksi</th>
                                <th className='border-2 bg-[#f2f2f2] text-[#333]'>Jenis Barang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDataPenjualan?.map(data => (
                                <tr key={data.id}>
                                    <td className='border-2 text-[#333]'>{data.id}</td>
                                    <td className='border-2 text-[#333]'>{data.name}</td>
                                    <td className='border-2 text-[#333]'>{data.stokAkhir}</td>
                                    <td className='border-2 text-[#333]'>{data.terjual}</td>
                                    <td className='border-2 text-[#333]'>{moment(data.createdAt).format('DD-MM-YYYY')}</td>
                                    <td className='border-2 text-[#333]'>{data.jenisBarang}</td>
                                    <td onClick={() => deleteDataPenjualan(data.id)} className='bg-red-400 cursor-pointer rounded-md text-white hover:bg-red-500'>Delete</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Data Penjualan!</h3>
                    {messageSuccessCreatePenjualan &&
                        <h3 className="font-semibold text-green-500 text-md">{messageSuccessCreatePenjualan}</h3>
                    }
                    <Formik
                    initialValues={{
                        product: '',
                        terjual: ''
                    }}
                    onSubmit={btnCreateDataPenjualan}
                    enableReinitialize
                >
                    {({handleSubmit, handleChange, handleBlur, values})=> (
                    <form onSubmit={handleSubmit}>
                        <p className="pt-6 pb-5">Pilih Nama Product</p>
                        <label onClick={toggleDropdown} tabIndex={0} className="cursor-pointer py-[12px] pl-[10px] pr-[30px] border-2 rounded-md">{selectedProduct}</label>
                        {isDropdownOpen && (
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {allDataProduct.map(data => (
                                    <li key={data.id}><a onClick={() => handleProduct(`${data.name}`, data.id)}>{data.name}</a></li>
                                ))}
                            </ul>
                        )}
                        <p className="pt-12 pb-2">Masukan Jumlah Terjual</p>
                        <input name='terjual' type="text" placeholder="Jumlah Terjual" className="input input-bordered w-full" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                        <div className='flex justify-end gap-6 items-end'>
                            <div className='bg-green-600 cursor-pointer w-20 h-12 rounded-md flex justify-center items-center'>
                                <button type="submit" className='text-white'>Create</button>
                            </div>
                            <div className="modal-action">
                                <label htmlFor="my_modal_6" className="btn">Close!</label>
                            </div>
                        </div>
                    </form>
                )}
                </Formik>
                </div>
            </div>
            <input type="checkbox" id="modal_update_stok" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Update Stok Product!</h3>
                    {messageSuccessCreatePenjualan &&
                        <h3 className="font-semibold text-green-500 text-md">{messageSuccessCreatePenjualan}</h3>
                    }
                    <Formik
                    initialValues={{
                        stok: '',
                    }}
                    onSubmit={btnUpdateStokProduct}
                    enableReinitialize
                >
                    {({handleSubmit, handleChange, handleBlur, values})=> (
                    <form onSubmit={handleSubmit}>
                        <p className="pt-6 pb-5">Pilih Nama Product</p>
                        <label onClick={toggleDropdown} tabIndex={0} className="cursor-pointer py-[12px] pl-[10px] pr-[30px] border-2 rounded-md">{selectedProduct}</label>
                        {isDropdownOpen && (
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {allDataProduct.map(data => (
                                    <li key={data.id}><a onClick={() => handleProduct(`${data.name}`, data.id)}>{data.name}</a></li>
                                ))}
                            </ul>
                        )}
                        <p className="pt-12 pb-2">Tambahkan Stok Product</p>
                        <input name='stok' type="text" placeholder="Tambahkan Stok Product" className="input input-bordered w-full" onChange={handleChange} onBlur={handleBlur} value={values.name} />
                        <div className='flex justify-end gap-6 items-end'>
                            <div className='bg-blue-600 cursor-pointer w-20 h-12 rounded-md flex justify-center items-center'>
                                <button type="submit" className='text-white'>Update</button>
                            </div>
                            <div className="modal-action">
                                <label htmlFor="modal_update_stok" className="btn">Close!</label>
                            </div>
                        </div>
                    </form>
                )}
                </Formik>
                </div>
            </div>
        </div>
    )
}

export default Penjualan