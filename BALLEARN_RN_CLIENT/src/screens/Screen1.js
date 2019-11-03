import React from 'react'
import { connect } from 'react-redux'
import   Screen from './Screen'
import { whileStatement } from '@babel/types';


class Screen1 extends Screen  {

    constructor(props) {
        super(props);     
        this.state = {
            width:  100,
            height: 100,  
            question: 'Wie viel 15 - 7 ? ',
            a1: '11',
            a2: '8', 
            a3: '11',
            a4: '9',
            startTime: [0,0,0,0],           
            rightAnswer: 2,
            answerFound: false,
            scala: 200,
            answerTimeLimit: 3000,
            answerBoxId: -1,
            alertAlreadyDisplayed: false,
            lastAnswer:-1,

        }    
       
    }
    componentDidUpdate(prevProps, prevState) {
        
        const { widthInit, heightInit} = this.state;
        if(prevProps.position!==this.props.position) {
            this.getBoxID();
        }
        if ((prevProps.navigationHeight !== this.props.navigationHeight && 
            this.props.navigationHeight!==0  ) || 
            (prevState.widthInit!==this.state.widthInit ) 
            || 
            (prevState.heightInit!==this.state.heightInit ) 
            
            ) {
            //console.log('this.props.navigationHeight', this.props.navigationHeight);
            //console.log('heightInit', heightInit);
            const width = widthInit;
            const height = heightInit - this.props.navigationHeight;

            const centerX = width/2;
            const centerY = height/2;
            const top = this.props.navigationHeight;
            //console.log('top_update', top)
            this.setState({width, height, centerX, centerY, top} );
        }    

    }
    renderLefttop() {
        const {width, height, top, answerBoxId, answerFound, rightAnswer } = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;       
        
       
        //console.log('top', top)
        const style = {
            top:`${top}px`,
            left:'0px',
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 
        let color = (answerBoxId===1)? 'red':'white';
        color = (answerFound && 1===rightAnswer) ?'blue': color;

        const styleText = {
            color: color
        }

        return (<div className="lefttop answerBox" style={style} >
           <div className="questionText" style={styleText}>
                   <p>  {this.state.a1} </p>
                </div> 
        </div>);
    }
    renderLefbottom() {
        const {width, height, top, answerBoxId, answerFound, rightAnswer} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:`${heightHalf+top}px`,
            left:'0px',
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 
        let color = (answerBoxId===2)? 'red':'white';
        color = (answerFound && 2===rightAnswer) ?'blue': color;
        const styleText = {
            color: color
        }

        return (<div className="leftbottom answerBox" style={style}>
            <div className="questionText " style={styleText}>
                   <p>  {this.state.a2} </p>
                </div> 
        </div>);
    }
    renderRighttop() {
        const {width, height, top, answerBoxId, answerFound, rightAnswer} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:`${top}px`,
            left:`${widthHalf}px`,
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 
        let  color = (answerBoxId===3)? 'red':'white';
        color = (answerFound && 3===rightAnswer) ?'blue': color;
        const styleText = {
            color: color
        }

        return (<div className="righttop answerBox" style={style}>
      <div className="questionText" style={styleText}>
                   <p>  {this.state.a3} </p>
                </div> 
    </div>);
    }
    renderRightbottom() {
        const {width, height, top, answerBoxId, answerFound, rightAnswer} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:`${heightHalf+top}px`,
            left:`${widthHalf}px`,
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 
        let color = (answerBoxId===4)? 'red':'white';
        color = (answerFound && 4===rightAnswer) ?'blue': color;
        const styleText = {
            color: color
        }

        return (<div className="rightbottom answerBox" style={style}>
                 <div className="questionText" style={styleText}>                 
                   <p>  {this.state.a4} </p>                
                </div> 
            </div>);
    }

    renderBigCircle() {
        const {width, height, top} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;
      
        const R = 0.4*Math.min(width, height);
        const R2 = R*2;

        const style = {
            top:`${heightHalf+top-R}px`,
            left:`${widthHalf-R}px`,
            width: `${R2}px`,
            height: `${R2}px`,            
        }; 

        return (<div className="bigCenterCircle" style={style}>
               <div className="bigCenterCircleText questionText">
                   <p>  {this.state.question} </p>
                </div> 
            </div>);
    }

    getBoxID ( ) {
        let answerBoxId = -1;
        let rightAnswer = -1;
        const {position} = this.props;  
        const {width, height, top, scala, lastAnswer} = this.state;

        let right = 0;
        let topCurrent = 0;  
        const  widthHalf = width/2; 
        const heightHalf = height/2;

        var start = Date.now();
        console.log('now', start)
        const lastAnswerBoxId = this.state.answerBoxId;

        if(position && position.rx && position.ry) {
          
            right = Math.floor(width*position.rx/scala);
            topCurrent = Math.floor(top + height* position.ry/scala);

            if(right<widthHalf && topCurrent<heightHalf) {
                answerBoxId = 3;
            } else if(right<widthHalf && topCurrent>heightHalf) {
                answerBoxId = 4;
            }else if(right>widthHalf && topCurrent<heightHalf) {
                answerBoxId = 1;
            }else if(right>widthHalf && topCurrent>heightHalf) {
                answerBoxId = 2;
            }
            //console.log('answerBoxId', answerBoxId)
            this.setState({answerBoxId});
        }
        if(lastAnswerBoxId===-1 || lastAnswerBoxId!==answerBoxId) {
            // CHANGE THE START TIME
            //console.log('WWWWWWWW');
            const a = [];
            for (let i = 0; i<4; i++) {
                if(i===answerBoxId) {
                    a[i] = Date.now();
                } else {
                    a[i] = -1;
                }
            }
            this.setState({startTime: a});
        } else if (lastAnswerBoxId!==-1 ) { 
          
            const {startTime} = this.state;
            const timeDiff = Date.now() - startTime[answerBoxId-1];
            console.log('timeDifftimeDifftimeDiff', timeDiff)
            console.log('timeanswerBoxIdanswerBoxId', answerBoxId)
            if(timeDiff > this.state.answerTimeLimit) {
               
                if( this.state.rightAnswer === answerBoxId && lastAnswer!==answerBoxId) {
                    alert('Congratulation! ');
                } else  if (lastAnswer!==answerBoxId) {
                    alert('Wrong answer!');
                }
                this.setState({answerFound: true, lastAnswer: answerBoxId});
            }
            
        }
    }
   

    renderCurrentPosition() {
        
        const {width, height, top, scala} = this.state;
        const {position} = this.props;      
        let right = 0;
        let topCurrent = 0;     

        //console.log('redux_postion', position)

        if(position && position.rx && position.ry) {           
            right = `${Math.floor(width*position.rx/scala)}px`;
            topCurrent = `${Math.floor(top + height* position.ry/scala)}px`;
        }
       
        const currentPoint = { right,top:topCurrent};
        if(position && position.rx && position.ry )
        return ( <div className="currentPoint" style={{...currentPoint}}/>);
         

    }
    render() { 
        const {width, height, answerFound, alertAlreadyDisplayed, answerBoxId} = this.state;        
        const {position, } = this.props;
        
               
        //let shouldBeDisplayd = window.localStorage.getItem('alertAlreadyDisplayed');
        //console.log('shouldBeDisplayd', shouldBeDisplayd);
        // const show = (shouldBeDisplayd===-1);
        
        /*if(shouldBeDisplayd===-1 &&  answerFound) {
           // this.setState({alertAlreadyDisplayed: true});
           console.log('XXXXXXX');
           window.localStorage.setItem('alertAlreadyDisplayed', 1);
        }*/
    
        //console.log('height', height)
        //console.log('redux_postion', position)
        //console.log('redux_connected', connected)
        return (
            <React.Fragment>
               {this.renderLefttop()}
               {this.renderLefbottom()}
               {this.renderRighttop()}
               {this.renderRightbottom()}
               {this.renderBigCircle()}
               {this.renderCurrentPosition()}
             
       
            </React.Fragment>
           );   
    }
  }


  const mapStateToProps = (state) => {  

    //console.log('mapStateToProps', state)
    return {
      //connected: state.connected,
      //refWebSocket: state.refWebSocket,
      position: state.position,
      navigationHeight: state.navigationHeight,
      //width: this.state.width, 
      //height: this.state.height-state.position,
    }
  }
  export default connect(mapStateToProps, 
        {   })(Screen1);
