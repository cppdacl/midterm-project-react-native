import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
  },

  topRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 9,
    marginRight: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  company: {
    fontSize: 14,
    marginBottom: 4,
  },

  salary: {
    fontSize: 14,
    fontWeight: '600',
  },

  details: {
    marginBottom: 16,
  },

  meta: {
    fontSize: 13,
    marginBottom: 4,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },

  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2f2e44',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  applyText: {
    color: '#fff',
    fontWeight: '600',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});