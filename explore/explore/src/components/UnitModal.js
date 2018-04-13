import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Unit.css';

class UnitModal extends React.Component {

    render() {
        // Render nothing if the "show" prop is false
        if(!this.props.show) {
            return null;
        }
        console.log(this.props);
        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50,
            zIndex: 100,


        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            margin: '0 auto',
            padding: 30,
            flex: 1,
            zIndex: 110,
            alignSelf: 'center',

        };

        const imageStyle = {
            borderRadius: 5,
            width: "50%",
            height: "auto",
            margin: '0 auto',
            flex: 1,
        };
        console.log(this.props);
        var backButton = ( <button onClick={() => this.props.lastPhoto()}>
            Back
        </button>);
        if(this.props.index === 0) {
            backButton=null;
        }

        var nextButton = (<button show={(this.props.index < this.props.maxIndex-1)} onClick={() => this.props.nextPhoto()}>
            Next
        </button>);

        if(this.props.index === this.props.maxIndex-1) {
            nextButton=null;
        }

        return (

        <div className="backdrop" style={backdropStyle}>
                <div style={modalStyle}>
                    <img className=" img-responsive" style={imageStyle} src={this.props.url}  />
                    <p>
                        {this.props.id}
                    </p>
                    <div className="footer">
                        <button onClick={this.props.onClose}>
                            Close
                        </button>


                    </div>
                    {backButton}
                    {nextButton}
                </div>
            </div>
        );
    }
}

UnitModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default UnitModal;