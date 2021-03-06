import * as React from 'react';
import {connect, useDispatch} from 'react-redux';
import ImageZoom from 'react-medium-image-zoom';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import GetApp from '@material-ui/icons/GetApp';

import * as API from "@util/API";

import "@style/components/favorite.scss";
import moment from "moment";
import * as Action from "@actions/Action";
import {ADD_FAVORITE, RESOLVE_FAVORITE, UPDATE_PAGE_TITLE} from "@actions/Types";

const { useState, useEffect } = React;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: {
      maxWidth: '100%',
      margin: '0 !important'
    },
  }),
);

interface FavoriteImage {
  [key: string]: any;
}

export const FavoritesScreen = (props: any) => {
  const dispatch = useDispatch();
  const classes = useStyles(props);

  const [ images, setImages ] = useState({});
  const [ listOpenedInfo, setListOpenedInfo ] = useState([]);

  const downloadAll = (date: string) => {
    window.open(
      API.path() + "/api/v1/download?date=" + date
    )
  }

  useEffect(
    () => {
      dispatch(
        Action.Page(
          UPDATE_PAGE_TITLE,
          {
            title: "Favorites",
          }
        )
      );

      dispatch(
        Action.Info(RESOLVE_FAVORITE)
      );

      API.call('/api/v1/favorite')
        .then((response: any) => {
          return response.json()
        })
        .then((json: any) => {
          setImages(json.dates);
          setListOpenedInfo((new Array(Object.keys(json.dates).length)).fill(false) as any)
        });
    },
    []
  );

  function toggleOpenedInfo(index: number) {
    setListOpenedInfo(
      listOpenedInfo.map(
        (value: boolean, key: number) => {
          return (index == key) ? !value : value
        }
      ) as []
    );
  }

  // sort items
  const dates = Object.keys(images).sort((a, b) => {
    a = a.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3 00:00:00');
    b = b.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3 00:00:00');
    return moment(b).unix() - moment(a).unix();
  });

  return (
    <>
      {
        dates.map((date, toggleIndex) => {
          const items: [] = (images as FavoriteImage)[date];
          return (
            <List
              key={date}
              component="div"
              style={{paddingTop: 0}}
            >
              <ListItem
                button
                onClick={() => toggleOpenedInfo(toggleIndex)}
              >
                <ListItemText
                  primary={date}
                  secondary={`${items.length.toLocaleString()} photos`}
                />
                {listOpenedInfo[toggleIndex] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={listOpenedInfo[toggleIndex]} timeout="auto" unmountOnExit>
                <div style={{textAlign: "right", paddingTop: "10px", paddingBottom: "10px"}}>
                  <Button onClick={() => downloadAll(date)}>
                    <GetApp />
                    Download
                  </Button>
                </div>
                <GridList cellHeight={160} className={classes.gridList} cols={3}>
                  {items.map((image: any, key) => {
                    return (
                      <GridListTile key={key} cols={1}>
                        <ImageZoom
                          image={{
                            src: API.path() + image.src,
                            className: 'c-favorite-image-thumbnail',
                          }}
                          zoomImage={{
                            src: API.path() + image.src,
                          }}
                        />
                      </GridListTile>
                    )
                  })}
                </GridList>
              </Collapse>
            </List>
          );
        })
      }
    </>
  );
};
