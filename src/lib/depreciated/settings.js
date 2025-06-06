'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sidenav expanded settings
  expandedMenu: true,

  // Navbar popup settings
  expandedPopup: {
    settings: false,
    accessCode: false,
    quickAccess: false,
    focusView: false,
  },
  popupClosing: {
    settings: false,
    accessCode: false,
    quickAccess: false,
    focusView: false,
  },

  // 
  formData: {
    name: "",
    description: "",
    status: 0,
    last_updated: "",
    release_date: "",

    version: "",
    pricing: 0,
    download: 0,
    sponsored: false,
    bryan_made: false,
    trial_period: "",
    featured: false,
    gatekeep: false,
    trending: false,

    bli_rate: "",
    avg_rate: "",
    user_rate: "",

    total_reviews: "",
    logo: "",
    favicon: "",
    preview_images: "",
    preview_videos: "",
    screenshots: "",
    theme_color: [],

    github: "",
    documentation: "",
    official_site: "",
    local_clone: "",
    socials: "",
    features: [],
    keywords: [],

    license: -1, //
    platforms: [],
    languages_supported: ["English"],
    usage_limits: "",

    developer_name: "",
    developer_website: "",
    developer_email: "",
    developer_socials: "",

    likes: 0,
    clicks: 0,
    views: 0,
    average_session_duration: "",
    bounce_rate: "",

    five_stars: 0,
    four_stars: 0,
    three_stars: 0,
    two_stars: 0,
    one_star: 0,

    a11y_compliance: [],
    keyboard_navigation: false,
    screen_reader_support: false,

    //geographic_usage: "",
    //sample_assets:
    //assets_zip:
    //clone_zip:

    payment_methods: [],
    refund_policy: ""
  },

  selectedCategories: [],
  selectedTags: [],
  jsonOutput: "",

  previewAvailable: false,

  previewPanelOpen: false,
  uploadPanelOpen: false,
  pastePanelOpen: false,
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {

    toggleMenu(state) {
      state.expandedMenu = !state.expandedMenu;
    },

    togglePopup(state, action) {
      // If popup is open, set it to closing state
      const popupName = action.payload;
      console.log("Toggling Popup:", popupName); // Debugging line
      if (state.expandedPopup[popupName]) {
        state.popupClosing[popupName] = true;
      } else {
        state.popupClosing[popupName] = false;
      }
      state.expandedPopup[popupName] = !state.expandedPopup[popupName];
    },
    closePopup(state, action) {
      console.log('close popup called');
      const popupName = action.payload;
      console.log(`Closing Popup: ${popupName}`);
      state.expandedPopup[popupName] = false;
      state.popupClosing[popupName] = false; // Reset closing state when closed
    },

    updateFormField(state, action) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    toggleCategory(state, action) {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter(
          (cat) => cat !== category
        );
      } else {
        state.selectedCategories.push(category);
      }
    },
    toggleTag(state, action) {
      const tag = action.payload;
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter((t) => t !== tag);
      } else {
        state.selectedTags.push(tag);
      }
    },

    generateJSON(state) {
      const toolData = {
        primary_details: {
          id: Date.now().toString(),
          name: state.formData.name,
          description: state.formData.description,
          features: state.formData.features,
        },
        quick_details: {
          status: state.formData.status,
          last_updated: state.formData.last_updated,
          release_date: state.formData.release_date,
          pricing: state.formData.pricing,
          download: state.formData.download,
          sponsored: state.formData.sponsored,
          bryan_made: state.formData.bryan_made,
        },
        extra_details: {
          version: state.formData.version,
          trial_period: state.formData.trial_period,
          license: state.formData.license,
          platforms: state.formData.platforms,
          languages_supported: state.formData.languages_supported,
          usage_limits: state.formData.usage_limits,
          payment_methods: state.formData.payment_methods,
          refund_policy: state.formData.refund_policy,
        },
        filtering_details: {
          featured: state.formData.featured,
          gatekeep: state.formData.gatekeep,
          trending: state.formData.trending,
          categories: state.selectedCategories,
          tags: state.selectedTags,
          keywords: state.formData.keywords,
        },
        ratings: {
          bli_rate: parseFloat(state.formData.bli_rate),
          avg_rate: parseFloat(state.formData.avg_rate),
          user_rate: parseFloat(state.formData.user_rate),
          total_reviews: parseInt(state.formData.total_reviews, 10),
          rating_distribution: {
            five_stars: state.formData.five_stars,
            four_stars: state.formData.four_stars,
            three_stars: state.formData.three_stars,
            two_stars: state.formData.two_stars,
            one_star: state.formData.one_star,
          },
        },
        visual_and_media: {
          logo: state.formData.logo,
          favicon: state.formData.favicon,
          theme_color: state.formData.theme_color,
          preview_media: {
            images: state.formData.preview_images
              .split(",")
              .map((url) => url.trim()),
            videos: state.formData.preview_videos
              .split(",")
              .map((url) => url.trim()),
          },
          screenshots: state.formData.screenshots,
        },
        links: {
          github: state.formData.github,
          official: state.formData.official_site,
          documentation: state.formData.documentation,
          local_clone: state.formData.local_clone,
          socials: state.formData.socials.split(",").map((url) => url.trim()),
        },
        developer_info: {
          name: state.formData.developer_name,
          website: state.formData.developer_website,
          contact_email: state.formData.developer_email,
          socials: state.formData.developer_socials
            .split(",")
            .map((url) => url.trim()),
        },
        analytics: {
          likes: parseInt(state.formData.likes, 10),
          clicks: parseInt(state.formData.clicks, 10),
          views: parseInt(state.formData.views, 10),
          average_session_duration: state.formData.average_session_duration,
          bounce_rate: state.formData.bounce_rate,
        },
        accessibility: {
          a11y_compliance: state.formData.a11y_compliance,
          keyboard_navigation: state.formData.keyboard_navigation,
          screen_reader_support: state.formData.screen_reader_support,
        },
      };

      state.jsonOutput = JSON.stringify(toolData, null, 4); // Save JSON output in Redux
      state.previewAvailable = true; // Show the output box
    },

    resetForm(state) {
      state.formData = { ...initialState.formData }; // Reset formData to its initial values
    },

    updateJSON(state, action) {
      const jsonData = action.payload;

      // Helper function to safely get nested values
      const getNestedValue = (obj, path, defaultValue = '') => {
        return path.split('.').reduce((acc, part) => acc?.[part] ?? defaultValue, obj);
      };

      // Mapping of JSON paths to form fields
      const fieldMappings = {
        'name': 'primary_details.name',
        'description': 'primary_details.description',
        'features': 'primary_details.features',
        'status': 'quick_details.status',
        'last_updated': 'quick_details.last_updated',
        'release_date': 'quick_details.release_date',
        'pricing': 'quick_details.pricing',
        'download': 'quick_details.download',
        'sponsored': 'quick_details.sponsored',
        'bryan_made': 'quick_details.bryan_made',
        'version': 'extra_details.version',
        'trial_period': 'extra_details.trial_period',
        'license': 'extra_details.license',
        'platforms': 'extra_details.platforms',
        'languages_supported': 'extra_details.languages_supported',
        'usage_limits': 'extra_details.usage_limits',
        'payment_methods': 'extra_details.payment_methods',
        'refund_policy': 'extra_details.refund_policy',
        'featured': 'filtering_details.featured',
        'gatekeep': 'filtering_details.gatekeep',
        'trending': 'filtering_details.trending',
        'keywords': 'filtering_details.keywords',
        'bli_rate': 'ratings.bli_rate',
        'avg_rate': 'ratings.avg_rate',
        'user_rate': 'ratings.user_rate',
        'total_reviews': 'ratings.total_reviews',
        'five_stars': 'ratings.rating_distribution.five_stars',
        'four_stars': 'ratings.rating_distribution.four_stars',
        'three_stars': 'ratings.rating_distribution.three_stars',
        'two_stars': 'ratings.rating_distribution.two_stars',
        'one_star': 'ratings.rating_distribution.one_star',
        'logo': 'visual_and_media.logo',
        'favicon': 'visual_and_media.favicon',
        'theme_color': 'visual_and_media.theme_color',
        'preview_images': ['visual_and_media.preview_media.images', (val) => val?.join(', ')],
        'preview_videos': ['visual_and_media.preview_media.videos', (val) => val?.join(', ')],
        'screenshots': 'visual_and_media.screenshots',
        'github': 'links.github',
        'official_site': 'links.official',
        'documentation': 'links.documentation',
        'local_clone': 'links.local_clone',
        'socials': ['links.socials', (val) => val?.join(', ')],
        'developer_name': 'developer_info.name',
        'developer_website': 'developer_info.website',
        'developer_email': 'developer_info.contact_email',
        'developer_socials': ['developer_info.socials', (val) => val?.join(', ')],
        'likes': ['analytics.likes', (val) => val?.toString()],
        'clicks': ['analytics.clicks', (val) => val?.toString()],
        'views': ['analytics.views', (val) => val?.toString()],
        'average_session_duration': 'analytics.average_session_duration',
        'bounce_rate': 'analytics.bounce_rate',
        'a11y_compliance': 'accessibility.a11y_compliance',
        'keyboard_navigation': 'accessibility.keyboard_navigation',
        'screen_reader_support': 'accessibility.screen_reader_support'
      };

      // Update form fields based on mappings
      Object.entries(fieldMappings).forEach(([formField, jsonPath]) => {
        if (Array.isArray(jsonPath)) {
          // Handle cases with transform functions
          const [path, transform] = jsonPath;
          const value = getNestedValue(jsonData, path);
          state.formData[formField] = transform(value);
        } else {
          // Handle direct mappings
          state.formData[formField] = getNestedValue(jsonData, jsonPath);
        }
      });

      // Update selection states
      state.selectedCategories = getNestedValue(jsonData, 'filtering_details.categories', []);
      state.selectedTags = getNestedValue(jsonData, 'filtering_details.tags', []);
    },

    togglePreviewPanel(state) {
      state.previewPanelOpen = !state.previewPanelOpen;
    },
    toggleUploadPanel(state) {
      state.uploadPanelOpen = !state.uploadPanelOpen;
    },
    togglePastePanel(state) {
      state.pastePanelOpen = !state.pastePanelOpen;
    },

  },
});

export const {
  toggleMenu,
  togglePopup,
  closePopup,
  updateFormField,
  toggleCategory,
  toggleTag,
  generateJSON,
  resetForm,
  updateJSON,
  togglePreviewPanel,
  toggleUploadPanel,
  togglePastePanel,
} = toolsSlice.actions;

export default toolsSlice.reducer;