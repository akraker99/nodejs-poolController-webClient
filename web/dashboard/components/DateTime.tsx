import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Timekeeper from 'react-timekeeper';
import '../css/modal.css'
import { comms } from './Socket_Client'
import * as React from 'react';

interface Props
{
  origDateTime: Date;
}
interface State
{
  modal: boolean,
  time: string;
  dateTime: Date;
  newDateTime: Date;
}

class DateTime extends React.Component<Props, State> {
  constructor( props: any )
  {
    super( props );
    let _dt = new Date(this.props.origDateTime);
    this.state = {
        modal: false,
        dateTime: _dt,
        newDateTime: _dt,
        time: `${_dt.getHours()}:${this.pad(_dt.getMinutes())}`
      };
      console.log(this.props.origDateTime)
    this.toggle = this.toggle.bind( this )
    this.submit = this.submit.bind( this );
    this.handleTimeChange = this.handleTimeChange.bind( this )
    this.handleDateChange = this.handleDateChange.bind( this )
    this.cancel = this.cancel.bind( this )
  }

  handleTimeChange ( newTime: any )
  {
    // event when time picker is closed
    let newDt = this.state.newDateTime;
    newDt.setHours( newTime.hour, newTime.minute );

    this.setState( {
      newDateTime: newDt,
      time: newTime.formatted24
    } )
  }

  handleDateChange ( newDate: any )
  {
    // event when date picker is closed
    let newDt = this.state.newDateTime;
    newDt.setMonth( newDate.getMonth() );
    newDt.setDate( newDate.getDate() );
    newDt.setFullYear( newDate.getFullYear() );
    console.log( `will update to ${ newDt.toLocaleString( 'en-US' ) }` )
     this.setState( {
      newDateTime: newDt
    } ) 
  }

  toggle ()
  {
    // open and close the modal
    this.setState( {
      modal: !this.state.modal
    } );
  }

  submit ()
  {
    // submit changes to socket
    comms.setDateTime(this.state.newDateTime)
    this.toggle()
  }

  cancel ()
  {
    // when cancel button is pressed reset state
    let _dt = new Date(this.props.origDateTime);
    this.setState( {
      modal: !this.state.modal,
      dateTime: _dt,
      newDateTime: _dt,
      time: `${_dt.getHours()}:${this.pad(_dt.getMinutes())}`
    } )
  }
  pad(n){
      return n < 10 ? `0${n}` : n;
  }
  render ()
  {
    const closeBtn = <button className="close" onClick={this.cancel}>&times;</button>;
    let dt = new Date(this.props.origDateTime).toLocaleString([], {month:'2-digit',day:'2-digit',year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: true})
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          {/* Update this to use 12/24 hour option if available */}
          {dt}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} size='xl' >
          <ModalHeader toggle={this.toggle} close={closeBtn}>Adjust time and date</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={{ size: 'auto', offset: 1 }}><InfiniteCalendar
                width={350}
                height={200}
                selected={this.state.dateTime}
                onSelect={this.handleDateChange}
              /></Col>
              <Col sm={{ size: 'auto', offset: 1 }}>
                <Timekeeper
                  time={this.state.time}
                  onChange={this.handleTimeChange}
                  switchToMinuteOnHourSelect={true}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color={this.state.newDateTime === this.props.origDateTime ? 'secondary' : 'primary'} onClick={this.submit}>{this.state.newDateTime === this.props.origDateTime ? 'Cancel' : 'Update'}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DateTime;