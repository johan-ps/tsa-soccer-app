import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { UiDropdown } from './_components';
import { useSelector } from 'react-redux';
import { getTeams } from '../store/actions/TeamActions';

const TeamsDropdown = props => {
  const teams = useSelector(state => state.teams);
  console.log("Joell teams", teams);

  const loadTeams = useCallback(async () => {
    try {
      await dispatch(getTeams());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    loadTeams();
  }, [dispatch, loadAnnouncements]);

  return (
    <View>
      {/* <UiDropdown
        modalOffsetY={220}
        modalOffsetX={42}
        options={teams}
        multiselect={true}
        group={true}
        placeholder="Choose teams"
        size="large"
        optionSize="large"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  
});

export default TeamsDropdown;
