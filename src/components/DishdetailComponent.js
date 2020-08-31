import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import {Card,CardImg,CardText,CardBody,CardTitle , Breadcrumb, BreadcrumbItem, Button, Label, Col, Row, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props){
		super(props);
		this.state = {
			isModalopen: false
        };
        
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComments = this.handleComments.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
        
        toggleModal(){
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

    handleSubmit(values) {
        this.toggleModal();
		this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

	handleComments(events){
		this.toggleModal();
    }
    render(){
        return(
            <React.Fragment>
               
                        <Button outline onClick={this.toggleModal}>
                            <span className='fa fa-pencil fa-lg'></span> Comments
                        </Button>
                    
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>
						Submit Comments
					</ModalHeader>
					<ModalBody>
					<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="rating" md={12}>Rating</Label>
                                    {/* <Control.text model=".rating"
                                        name="rating"
                                        className="rating"/> */}
                                <Col md={{size: 12}}>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                        </Row>
                        <Row className="form-group">
                                <Label htmlFor="yourname" md={12}>Your Name</Label>
                                <Col sm={12}>
                                    <Control.text model='.yourname' id="yourname" name="yourname"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".yourname"
                                        show="touched"
                                        messages={{
                                            minLength: ' Must be greater than 2 characters',
                                            maxLength: ' Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="message" md={12}>Comments</Label>
                                <Col sm={12}>
                                    <Control.textarea model=".message" id="message" name="message"
                                        rows="6"
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col sm={{size: 3}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                    </LocalForm>
					</ModalBody>
				</Modal>
            </React.Fragment>
        );
    }
}

function RenderComments({ comments, postComment, dishId }) {
    // const commentList = comments.map(comment => {
    //     return (
    //         <Fade in>
    //         <li key={comment.id}>
    //             <p>{comment.comment}</p>
    //             <p>--{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
    //         </li>
    //         </Fade>
    //     )
    // })
    if (comments !=null)
    return (
        <div className="col-12">
            <h4>Comments</h4>
            <ul className="list-unstyled">
                <Stagger in>
                    {comments.map((comment) => {
                        return (
                            <Fade in>
                            <li key={comment.id}>
                            <p>{comment.comment}</p>
                            <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                            </li>
                            </Fade>
                        );
                    })}
                </Stagger>
            </ul>
            <CommentForm dishId={dishId} postComment={postComment} />
        </div>
    )
}

    function RenderDish({dish}) {
        return dish !== null ? (
            <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)'}}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        ) : <div></div>;
    }

    const DishDetail = (props) => {
        if (props.isLoading){
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
    	else if (props.dish != null)

        	return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-3 m-1">
                            <RenderDish dish = {props.dish} />
                        </div>
                        <div className="col-12 col-md-3 m-1">
                            <RenderComments comments={props.comments}
                            postComment = {props.postComment}
                            dishId = {props.dish.id} />
                        </div>
                    </div>
                </div>
            );
        else{
            return(
                <div></div>
            );
        }
    }


export default DishDetail;
// export default CommentForm;