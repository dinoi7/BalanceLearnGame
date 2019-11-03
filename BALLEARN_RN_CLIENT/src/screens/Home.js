import React, { Component} from 'react'


class Home extends Component  {

    constructor(props) {
        super(props);        
        this.howItWorks = this.howItWorks.bind(this);       
    }

    howItWorks () {
        console.log('howItWorks pushed')
        this.props.history.push('/howitworks') 
    }


    render() {   
        return (
            <React.Fragment>
                <div className="grid-container">
                    <div className="item1">
                    lefttop
                    </div>
                    <div className="item2">
                    leftbottom   
                    </div>
                    <div className="item3">                       
                    righttop 
                    </div>  
                    <div className="item4">
                    rightbottom
                    </div>
                    <div className="item5">
                    header   
                    </div>
                    <div className="item6">
                    ball   
                    </div>
                    <div className="item7">
                    footer   
                    </div>
                </div>                 
            </React.Fragment>
        );
    }
    render1() {   
        return (
            <React.Fragment>
                <div className="grid-container5">
                    <div className="item51">
                    header
                    </div>
                    <div className="item52">
                    menu   
                    </div>
                    <div className="item53" 
                        onClick={this.howItWorks} >
                            main 
                    </div>  
                    <div className="item54">
                    right
                    </div>
                    <div className="item55">
                    footer   
                    </div>
                </div>                 
            </React.Fragment>
        );
    }
}


export default Home;
