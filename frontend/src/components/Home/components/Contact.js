import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import contact1 from '../images/contact1.jpg'
import './styling.css';
import { toast } from 'react-toastify';

const Contact = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    to_name: '',
    from_name: '',
    message: '',
  });
  useEffect(()=>{
    window.scrollTo(0, 0);
 },[]);
 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_b8w3fbs', 'template_jwxga0b', form.current, 'IbKEkzMWeB4fDNBSj')
      .then(
        () => {
          toast.success("We got your message!, we'll get back to you.");
          setFormData({
            to_name: '',
            from_name: '',
            message: '',
          })
        },
        (error) => {
          toast.warning('FAILED...', error.text);
        },
      );
  };

  return (
    <div className='p-1'>

      <section className="branches mt-5">
        <div className="container">
          <h2 style={{color:"white", marginBottom:"50px"}}>Our Branches </h2>
          <div className="row mb-5 ">
            <div className="col-md-5 px-5 py-4" style={{color:"white"}}>
              <h4>RamanaSoft Consulting Services</h4>
              <p>
                Aditya Trade Center<br />
                404, fourth floor, <br />
                Ameerpet, Hyderabad<br />
                Telangana, India.
              </p>
              <p>
                <strong>Phone:</strong> 1800-2020-0344<br />
                <strong>Email:</strong> support@ramanasoft.com
              </p>
            </div>
            <div className="col-md-7">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238.0516257759557!2d78.44636970361658!3d17.43667573157586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90cf65909a77%3A0x711aa7f9600e3ad1!2sAditya%20Trade%20Center!5e0!3m2!1sen!2sus!4v1718983589638!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location 1"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className='contact-form container'>
        <div className='mb-4 mt-3 d-flex align-items-center row' style={{padding:"100px 0"}}>
          <div className='form shadow rounded col-6'>
            <h2 className='text-center fw-bold' style={{color:"white"}}>Contact Us <i className="fa-solid fa-comment"></i></h2>
            <form ref={form} onSubmit={sendEmail} >
              <div className="mb-3">
                <label htmlFor="to_name" className="form-label fw-bold" style={{color:"white"}}>Name</label>
                <input
                  type="text"
                  style={{border:"1px solid white", background:"none"}}
                  className="form-control"
                  id="to_name"
                  name="to_name"
                  value={formData.to_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="from_name" className="form-label fw-bold" style={{color:"white"}}>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="from_name"
                  style={{border:"1px solid white", background:"none"}}
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-bold" style={{color:"white"}}>Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  style={{border:"1px solid white", background:"none"}}
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div style={{right:"50px", alignItems:"left"}}>
                <button type="submit" className="btn px-4 fw-bold border shadow"  style={{color:"white"}}>Submit <i className="fa-solid fa-paper-plane"></i></button>
              </div>
            </form>
          </div>
          <div className='col-6'>
            <img src={contact1} alt='' height="400px" width="500px" />
          </div>
        </div>
      </section>

      {showBackToTop && (
        <div className="back-to-top" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }} onClick={scrollToTop}>
          <button className='p-2 rounded btn btn-outline-dark' title='back to top'>
            <i className="fas fa-arrow-up text-warning fs-5"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Contact;
