import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';

 class ProfileHeader extends Component {

  render() {
    const { profile } = this.props;
    let socialMedias = null;

    if (isEmpty(profile.social)) socialMedias =  null;
    else {
      for (let media in profile.social) {
        isEmpty(profile.social[media]) ? socialMedias = null : 
          socialMedias = (
            <a className="text-white p-2" href={'https://' + profile.social[media]} target="_blank">
            <i className={`fab fa-${media} fa-2x`}></i>
            </a>
          )
      }
    }
    
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img className="rounded-circle" src={profile.user.avatar} alt="" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">{profile.status} {isEmpty(profile.company) ? null : (<span>at {profile.company}</span>)}</p>
              {isEmpty(profile.location) ? null : (<p>{profile.location}</p>)}
              <p>
                {isEmpty(profile.website) ? null : (
                  <a className="text-white p-2" href={'https://' + profile.website} target="_blank">
                    <i className="fas fa-globe fa-2x"></i>
                  </a>
                )}
                {socialMedias}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileHeader;
