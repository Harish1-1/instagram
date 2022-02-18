import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import UsersPosts from '../UsersPosts'

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    storiesFetchStatus: dataFetchStatusConstants.initial,
    userStories: [],
    postsFetchStatus: dataFetchStatusConstants.initial,
    usersPosts: [],
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    this.getUserStories(jwtToken, options)
    this.getUsersPosts(jwtToken, options)
  }

  getUserStories = async (jwtToken, options) => {
    this.setState({storiesFetchStatus: dataFetchStatusConstants.loading})
    const response = await fetch(
      'https://apis.ccbp.in/insta-share/stories',
      options,
    )

    if (response.ok) {
      const data = await response.json()
      const userStories = data.users_stories
      this.setState({storiesFetchStatus: dataFetchStatusConstants.success})
      this.setState({userStories})
    }
    if (!response.ok) {
      this.setState({storiesFetchStatus: dataFetchStatusConstants.failure})
    }
  }

  getUsersPosts = async (jwtToken, options) => {
    this.setState({postsFetchStatus: dataFetchStatusConstants.loading})
    const response = await fetch(
      'https://apis.ccbp.in/insta-share/posts',
      options,
    )
    if (response.ok) {
      const data = await response.json()
      const usersPosts = data.posts
      this.setState({postsFetchStatus: dataFetchStatusConstants.success})
      this.setState({usersPosts})
    }
    if (!response.ok) {
      this.setState({postsFetchStatus: dataFetchStatusConstants.failure})
    }
  }

  reGetUserStories = () => {
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    this.getUserStories(jwtToken, options)
  }

  reGetUserPosts = () => {
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    this.getUsersPosts(jwtToken, options)
  }

  renderUserStories = () => {
    const {userStories, storiesFetchStatus} = this.state
    const settings = {
      dots: true,

      slidesToScroll: 1,
    }
    switch (storiesFetchStatus) {
      case dataFetchStatusConstants.loading:
        return (
          <div
            className="loader-container"
            testid="loader"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
          </div>
        )
      case dataFetchStatusConstants.success:
        return (
          <div>
            <div
              style={{
                backgroundColor: 'blue',
                display: 'flex',
                flexDirection: 'Column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* for small screen */}
              <Slider
                {...settings}
                slidesToShow={4}
                style={{
                  width: '92%',
                }}
              >
                {userStories.map(each => (
                  <div key={each.user_id}>
                    <div>
                      <div>
                        <img src={each.story_url} alt="user story" />
                        <p>{each.user_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* for large screens */}
              <Slider
                {...settings}
                slidesToShow={7}
                style={{
                  width: '92%',
                }}
              >
                {userStories.map(each => (
                  <div key={each.user_id}>
                    <div>
                      <div>
                        <img src={each.story_url} alt="user story" />
                        <p>{each.user_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )
      case dataFetchStatusConstants.failure:
        return (
          <div>
            <div>
              <img
                src="https://res.cloudinary.com/duqlsmi22/image/upload/v1645180684/alert-triangle-failure-view_htbcnn.png"
                alt="failure-view"
              />
            </div>
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={this.reGetUserStories}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  renderUsersPosts = () => {
    const {usersPosts, postsFetchStatus} = this.state
    console.log(usersPosts)
    switch (postsFetchStatus) {
      case dataFetchStatusConstants.success:
        return (
          <ul>
            {usersPosts.map(eachPost => (
              <UsersPosts key={eachPost.post_id} userPost={eachPost} />
            ))}
          </ul>
        )
      case dataFetchStatusConstants.loading:
        return (
          <div
            className="loader-container"
            testid="loader"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
          </div>
        )
      case dataFetchStatusConstants.failure:
        return (
          <div>
            <div>
              <img
                src="https://res.cloudinary.com/duqlsmi22/image/upload/v1645180684/alert-triangle-failure-view_htbcnn.png"
                alt="failure-view"
              />
            </div>
            <p>Something went wrong. Please try again</p>
            <button type="button" onClick={this.reGetUserPosts}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        {this.renderUserStories()}
        {this.renderUsersPosts()}
      </div>
    )
  }
}

export default Home
