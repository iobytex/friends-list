import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import friendstyles from '../styles/FriendsAccount.module.css'
import { Form, Button, Card, Modal } from 'react-bootstrap'
import { toast,ToastContainer } from 'react-toastify'

type ModalProps = {
  index: number
  show: boolean,
  updateFriendList: () => void
  onHide: () => void
}
const MyVerticallyCenteredModal = ({index, show, updateFriendList ,onHide}: ModalProps) => {
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [formfilled, setFormFilled] = useState(false);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const onChangeWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value)
  }

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  useEffect(() => {
    if ( typeof window !== 'undefined' && typeof(Storage) !== "undefined") {  
      let item = localStorage.getItem(index.toString())
      if(item!=null){
        let friends_details = JSON.parse(item) as Wallet;
        setName(friends_details.wallet_name)
        setWalletAddress(friends_details.wallet_address)
        setEmail(friends_details.wallet_email)
      }
    }
  }, [index])
  

  type Wallet = {
    id: number,
    wallet_name: string,
    wallet_address: string,
    wallet_email: string
  }

  const handleUpdate = (value: number) => {
    
    if (name.length > 3 && walletAddress.length > 10 && email.includes("@")){
      const wallet_details: Wallet = {
        id: value,
        wallet_name: name,
        wallet_address: walletAddress,
        wallet_email: email,
      }
      localStorage.setItem(wallet_details.id.toString(), JSON.stringify(wallet_details))
      toast.success('Friends Account Updated Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
        });
      updateFriendList()
      setTimeout(()=> {toast.dismiss()},1000)
    }
    
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update {name} Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className={"mb-3"} controlId={"name"}>
              <Form.Label>Name</Form.Label>
              <Form.Control type={"text"} placeholder="Enter name"  onChange={onChangeName} value={name}/>
          </Form.Group>
          <Form.Group className={"mb-3"} controlId={"walletAddress"}>
            <Form.Label>Wallet address</Form.Label>
            <Form.Control type="text" placeholder="Enter Wallet Address"  pattern={"/^0x[a-fA-F0-9]{40}$/g"} onChange={onChangeWalletAddress} value={walletAddress}/>
            <Form.Text className="text-muted">
              Ethereum Wallet Address Only
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" onChange={onChangeEmail} value={email} />
          </Form.Group>
          <Button variant={"primary"} type={"submit"} onClick={() =>{handleUpdate(index); }} disabled={formfilled} id={"submit"}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} id={"onhide"}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



const WalletForm = () => {
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [formfilled, setFormFilled] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [friendsacct, setFriendsAcct] = useState<Wallet[]>([]);


  const handleShow = (index:number) =>{
    setItemIndex(index)
    setModalShow(true)

  } 

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const onChangeWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
    
    
    setWalletAddress(event.target.value)
    
  }

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  type Wallet = {
    id:number,
    wallet_name: string,
    wallet_address: string,
    wallet_email: string
  }

  const handleAddAccount = (event: MouseEvent<HTMLButtonElement>) => {
    if(!walletAddress.match("/^0x[a-fA-F0-9]{40}$/g")){
      toast.error('Incorrect Wallet Address', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
        });
        setTimeout(()=> {toast.dismiss()},1000)
    }else{
      if (name.length > 3 && walletAddress.length > 10 && email.includes("@")){
      
        event.preventDefault();
        
        const length:number = localStorage.length === 0 ? 1 : localStorage.length + 1;
        const wallet_details: Wallet = {
          id:length,
          wallet_name: name,
          wallet_address: walletAddress,
          wallet_email: email,
        }
        localStorage.setItem(wallet_details.id.toString(), JSON.stringify(wallet_details))
        toast.success('Friends Account Added Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 100,
          });
        updateFriendList()
        setTimeout(()=> {toast.dismiss()},1000)
      }else{
        toast.success('Please check your details', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 100,
          });
        setTimeout(()=> {toast.dismiss()},1000)
      }
    }
  }


const updateFriendList = useCallback(() => {
  let friendlist: Wallet[] =[]
  if ( typeof window !== 'undefined' && typeof(Storage) !== "undefined") {  
    for(let i=1; i <= localStorage.length ; i++ ){
      let item = localStorage.getItem(i.toString());
      if (item!=null) {
        friendlist.push(JSON.parse(item) as Wallet)
      }
    }
  }
  setFriendsAcct(friendlist) 
  friendlist = [] 
},[])
  
  
  useEffect(()=> {
    if (name.length > 3 && walletAddress.length > 10 && email.includes("@")){
        setFormFilled(false)
    }
    updateFriendList()
  }, [email, name.length, updateFriendList, walletAddress.length])
 
  const handleDelete = (index: number) => {
    let item = localStorage.getItem(index.toString())
    if(item!=null){ 
      localStorage.removeItem(index.toString())
      toast.success(`🦄 ${(item as unknown as Wallet).wallet_name} details has been deleted Successfully`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
        });
        updateFriendList()
        setTimeout(()=> {toast.dismiss()},1000)
      
    }else{
      toast.error('An error occurred! ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
        });
        setTimeout(()=> {toast.dismiss()},1000)
    }
  }
 

  return (
    <div>
      <div>
      <Form>
        <Form.Group className={"mb-3"} controlId={"name"}>
            <Form.Label>Name</Form.Label>
            <Form.Control type={"text"} placeholder="Enter name"  onChange={onChangeName} value={name}/>
        </Form.Group>

        <Form.Group className={"mb-3"} controlId={"walletAddress"}>
          <Form.Label>Wallet Address</Form.Label>
          <Form.Control type="text" placeholder="Enter Wallet Address"  pattern={"/^0x[a-fA-F0-9]{40}$/g"} onChange={onChangeWalletAddress} value={walletAddress}/>
          <Form.Text className="text-muted">
            Ethereum Wallet Address Only
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email" onChange={onChangeEmail} value={email} />
        </Form.Group>
        <Button variant={"primary"} type={"submit"} onClick={handleAddAccount} disabled={formfilled}>
          Submit
        </Button>
      </Form>
    </div>
    <div className={friendstyles.flexcontainer} >
      {
        friendsacct.map((wallet) =>
        <div key={wallet.id}> 
          <Card border="primary" style={{ width: '20rem' , margin: '1rem'}} key={wallet.id}>
            <Card.Body  key={wallet.id}>
              <Card.Title  key={wallet.id}>{wallet.wallet_name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted"  key={wallet.id}>{wallet.wallet_email}</Card.Subtitle>
              <Card.Text  key={wallet.id}>{wallet.wallet_address}</Card.Text>
              <Button variant={"primary"} type={"submit"} onClick={() => { 
                handleShow(wallet.id); }
                } size="sm" style={{marginRight: '1rem'}}  key={wallet.id}>
                Update
              </Button>
              <Button variant={"primary"} type={"submit"} onClick={() => { 
                 handleDelete(wallet.id); }
              } size="sm"  key={wallet.id}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        </div>
        )
      }
    </div>
    <MyVerticallyCenteredModal
        index = {itemIndex}
        show={modalShow}
        updateFriendList= {updateFriendList}
        onHide={() => setModalShow(false)}
      />
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
  </div>
  )
}

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>XLD Finance</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://xld.finance">XLD Finance</a>
        </h1>

        <WalletForm/>
      </main>

    </div>
  )
}

export default Home
