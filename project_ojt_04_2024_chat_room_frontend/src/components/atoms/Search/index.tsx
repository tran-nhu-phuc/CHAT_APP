/* eslint-disable @typescript-eslint/ban-types */
import './index.scss';
import React from 'react';
import { IconSearch } from '../Icon/Icon';
interface Props {
  handelGetDataSearchRoom: Function;
}
const Search: React.FC<Props> = (props: Props) => {
  return (
    <div className="search-atom__container">
      <div className="search-atom-icon-search">
        <IconSearch />
      </div>
      <div className="search-atom-box-search">
        <input
          type="search"
          placeholder="Search room..."
          onChange={(e) =>
            setTimeout(() => {
              props.handelGetDataSearchRoom(e.target.value);
            }, 500)
          }
        />
      </div>
    </div>
  );
};

export default Search;
