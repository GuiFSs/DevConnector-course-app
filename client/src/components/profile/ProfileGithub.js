import React, { Component } from 'react'
import PropTypes from 'prop-types';

 class ProfileGithub extends Component {

  state = {
    clientId: '9c012c997032685e2640',
    clientSecret: '7696c162465e192560b1717534c6bf38efa4a330',
    count: 5,
    sort: 'created: asc',
    repos: []
  }

  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret} = this.state;

    fetch(`http://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(data => {
        this.setState({repos: data});
      })
      .catch(err => console.log(err));
  }

  component

  render() {
    const { repos } = this.state;
    if (!repos.message === 'Not Found') return null;
    const repoItems = repos.map(repo => (
      
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank" >
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Stars: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Stars: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div>
        <hr/>
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGithub;
