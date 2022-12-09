import React, { useState, useEffect } from 'react'

import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';

import Confetti from 'react-confetti'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AppBar, Button, IconButton, Slide, Switch, Toolbar, Typography } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const Home = ({ id, setid }) => {
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [data3, setdata3] = useState([]);
  const [data4, setdata4] = useState([]);
  const [notreloaded, setnotreloaded] = useState(true);
  const [opendec, setopendec] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [open1, setOpen1] = React.useState(false);

  const [open2, setOpen2] = React.useState(false);


  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
    if (response.data.length === 0) {
      setOpen1(false)
      setOpen(false)
    }
    const checkifdataPresent =await response.data.filter((data) => data.checked == '1' && data.iscompleted == '0')

    if (checkifdataPresent.length > 0 && notreloaded) {

      handleClickOpen2();
      setnotreloaded(false);

    }else
    {
      setnotreloaded(false);
    }
    if(checkifdataPresent.length===0 && notreloaded===false){

      makedecopen();
     
    }
    setdata(response.data);
    setdata2(response.data.filter((data) => data.iscompleted == '0'));
    setdata3(response.data.filter((data) => data.iscompleted == '1'));
    setdata4(response.data.filter((data) => data.checked == '1' && data.iscompleted == '0'));



  }
  useEffect(() => {
    loadData();
  }, []);

  const DeleteTask = (id) => {  
    axios.delete(`http://localhost:5000/api/remove/${id}`);
    toast.success("Task deleted successully")

    setTimeout(() => {
      loadData()
    }, 500);

  }
  const completeTask = (id) => {

    axios.put(`http://localhost:5000/api/complete/${id}/1`);
    toast.success("Task done successully")

    setTimeout(() => {
      loadData()
    }, 500);

  }




  const [state, setstate] = useState({ todo: "", checked: "" });
  const [check, setcheck] = useState(false);
  const { todo } = state;

  const makedecopen = () => {
    setopendec(true);
    setTimeout(() => {
      setopendec(false);
      handleClose2();
    }, 4000);
  }
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/get/${id}`).then((res) => { setstate({ ...res.data[0] }); setcheck(res.data[0].checked === '1' ? true : false) });
    }

  }, [id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo) {
      toast.error("Input field can not be empty")
    } else {
      if (!id) {

        axios.post("http://localhost:5000/api/post",
          {
            todo, check
          })
          .then(() => {




            setstate({ todo: "" });
            loadData();
            handleClose();
          })
          .catch((err) => toast.error(err.response.data))
        toast.success("Task Added successfully")
          ()
      } else {
        axios.put(`http://localhost:5000/api/update/${id}`,
          {
            todo, check
          })
          .then(() => {
            setstate({ todo: "" });
            loadData();
            handleClose();
          })
          .catch((err) => toast.error(err.response.data))
        toast.success("Task Updated successfully")
        setid("");

      }

    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setstate({ ...state, [name]: value })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setid("");
    setstate({ todo: "" })
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  }
  const handleClose1 = (value) => {
    setOpen1(false);
    setid("");
    setstate({ todo: "" })
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  }
  const handleClose2 = (value) => {
    setOpen2(false);

  };

  return (
    <>


      <div className='Navbar_div_Admin'>
        <div className='Navbar_Navlinks_Menu'>
          <div style={{

            height: '10vh', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'whitesmoke'
          }}>

            <div><h1>To-do List App</h1></div>
          </div>

          <div style={{ height: '0px', width: '0px', visibility: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

          </div>
        </div>


      </div>
      <Dialog onClose={handleClose} open={open}>
        <div style={{ marginTop: "20px" }}>
          <form style={{ margin: "auto", padding: "20px", maxWidth: "400px", alignContent: "center" }} onSubmit={handleSubmit}>
            <label htmlFor='name' style={{ margin: '0 140px', fontWeight: 'bold' }}  >{id ? "Update your task" : "Add your task"}</label>
            <input type="text" id='todo' name='todo' placeholder='Your Task' value={todo || ""} onChange={handleInputChange} />

            <div onClick={check ? () => setcheck(false) : () => setcheck(true)}>Mark it as urgent task <Switch checked={check} /></div>
            <input type="submit" value={id ? "Update" : "Save"} />

            <input onClick={handleClose} type="button" value="Go back" />
          </form>
        </div>
      </Dialog>
      <Dialog onClose={handleClose1} open={open1}>
        {data3.length === 0 && <h4 style={{ textAlign: 'center', padding: '20px' }}> Please complete any task first!</h4>}
        {data3.length !== 0 &&
          <table className='styled-table'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>No.</th>
                <th style={{ textAlign: 'center' }}>Task</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>

              {data3.map((item, index) => {
                return (


                  <>


                    <tr key={item.id}>
                      <th scope='row'>{index + 1}</th>
                      <th>{item.todo}</th>
                      <th>


                      {item.checked === '0' && <WhatshotIcon style={{ color: 'transparent', paddingRight: '10px' }} />}
                          {item.checked === '1' && <WhatshotIcon style={{ color: 'orangered', paddingRight: '10px' }} />}
                        &nbsp;  &nbsp;
                        <DeleteIcon style={{ cursor: "pointer", color: 'red' }} onClick={() => DeleteTask(item.id)} />


                      </th>

                    </tr>
                  </>


                )
              })}
            </tbody>
          </table>}


      </Dialog>
      <Dialog
        fullScreen
        onClose={handleClose2} open={open2}
        TransitionComponent={Transition}

      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'black' }}>
          <Toolbar  >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose2}
              aria-label="close"
            >

            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              You have Some urgent tasks which are pending!
            </Typography>
            <Button style={{ color: 'beige' }} autoFocus color="inherit" onClick={handleClose2}>
              Thanks, I'll do these later
            </Button>
          </Toolbar>
        </AppBar>
        {opendec===true && <Confetti
          width={1200}
          height={1000}
        />}
        {data4.length === 0 &&  <h4 style={{ textAlign: 'center', padding: '20px',marginTop:'250px' }}>  you have completed all your urgent tasks!</h4>}
        {data4.length !== 0 &&
          <>
            <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <img className='image' src="https://st2.depositphotos.com/1001599/43591/v/450/depositphotos_435912210-stock-illustration-deadline-abstract-concept-vector-illustration.jpg" />


              <table className='styled-table' >
                <thead>

                  <tr>
                    <th style={{ textAlign: 'center' }}>No.</th>
                    <th style={{ textAlign: 'center' }}>Task</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {data4.map((item, index) => {
                    return (


                      <>


                        <tr key={item.id}>
                          <th scope='row'>{index + 1}</th>
                          <th>{item.todo}</th>
                          <th>


                            <DeleteIcon style={{ cursor: "pointer", color: 'red' }} onClick={() => DeleteTask(item.id)} />
                            &nbsp;  &nbsp;


                            <CheckCircleIcon style={{ cursor: "pointer", color: 'green' }} onClick={() => completeTask(item.id)} />

                          </th>

                        </tr>
                      </>


                    )
                  })}
                </tbody>
              </table>  </div></>}


      </Dialog>



      <>

        <div style={{ marginTop: "120px" }}>
          {data2.length === 0 && <h3 style={{ textAlign: 'center', color: 'whitesmoke' }}> Add task first to display tasks</h3>}
          <button onClick={handleClickOpen} className="btn btn-contact">Add new Task</button>
          <button onClick={handleClickOpen1} className="btn btn-contact">completed Tasks</button>
          {data2.length !== 0 &&
            <table className='styled-table'>
              <thead>

                <tr>
                  <th style={{ textAlign: 'center' }}>No.</th>
                  <th style={{ textAlign: 'center' }}>Task</th>
                  <th style={{ textAlign: 'center' }}>Action</th>

                </tr>
              </thead>

              <tbody>


                {data2.map((item, index) => {
                  return (


                    <>


                      <tr key={item.id} >
                        <th scope='row'>{index + 1}</th>
                        <td>{item.todo}</td>
                        <td>
                          {item.checked === '0' && <WhatshotIcon style={{ color: 'transparent', paddingRight: '30px' }} />}
                          {item.checked === '1' && <WhatshotIcon style={{ color: 'orangered', paddingRight: '30px' }} />}
                          <CheckCircleIcon style={{ cursor: "pointer", color: 'green' }} onClick={() => completeTask(item.id)} />
                          &nbsp;  &nbsp;
                          <EditIcon onClick={() => { handleClickOpen(); setid(item.id) }} style={{ cursor: 'pointer', color: 'black' }} />

                          &nbsp;  &nbsp;
                          <DeleteIcon style={{ cursor: "pointer", color: 'red' }} onClick={() => DeleteTask(item.id)} />


                        </td>


                      </tr>
                    </>


                  )
                })}
              </tbody>
            </table>
          }
        </div>
      </>


    </>
  )
}

export default Home