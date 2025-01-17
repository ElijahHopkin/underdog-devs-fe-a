import React from 'react';

import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { NavBtnLink } from '../../NavBarLanding/NavBarStyle';

function ApplyButton() {
  const { isAuthenticated } = useAuth0();
  const { push } = useHistory();

  return (
    !isAuthenticated && (
      <NavBtnLink
        className="btn btn-primary btn-block"
        onClick={() => push('/apply')}
      >
        Apply
      </NavBtnLink>
    )
  );
}

export default ApplyButton;
