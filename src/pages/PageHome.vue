<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newTwistContent"
            label="Whats hapenning?"
            counter
            maxlength="280"
            autogrow
            class="new-twist"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>

        <div class="col col-shrink">
          <q-btn
            @click="addNewTwist"
            class="q-mb-lg"
            unelevated
            rounded
            no-caps
            color="primary"
            label="Twist"
            :disable="!newTwistContent"
          />
        </div>
      </div>

      <q-separator size="10px" color="grey-3" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="twist q-py-md" v-for="twist in twists" :key="twist.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Alexis Sahagun</strong>
                <span class="text-grey-7">
                  @AlexisSahagun1 <br class="lt-md" />&bull;
                  {{ twist.date | relativeDate }}
                </span>
              </q-item-label>

              <q-item-label class="twist-content text-body2">{{
                twist.content
              }}</q-item-label>

              <div class="twist-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                />
                <q-btn
                  @click="toggledLiked(twist)"
                  flat
                  round
                  :color="twist.liked ? 'pink' : 'grey'"
                  :icon="twist.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                />

                <q-btn
                  @click="deleteTwist(twist)"
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "src/boot/firebase";
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newTwistContent: "",
      twists: [
        // {
        //   id: 'ID1',
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam aut autem aliquid, a, animi expedita soluta vero possimus accusantium omnis veritatis labore eligendi, nisi cumque! Vero molestias maiores minus?",
        //   date: 1625595451610,
        //   liked: false,
        // },
        // {
        //   id: 'ID2',
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam aut autem aliquid, a, animi expedita soluta vero possimus accusantium omnis veritatis labore eligendi, nisi cumque! Vero molestias maiores minus?",
        //   date: 1625595503914,
        //   liked: false,
        // },
        // {
        //   id: 'ID3',
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam aut autem aliquid, a, animi expedita soluta vero possimus accusantium omnis veritatis labore eligendi, nisi cumque! Vero molestias maiores minus?",
        //   date: 1625595518549,
        //   liked: false,
        // },
        // {
        //   id: 'ID4',
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam aut autem aliquid, a, animi expedita soluta vero possimus accusantium omnis veritatis labore eligendi, nisi cumque! Vero molestias maiores minus?",
        //   date: 1625595524405,
        //   liked: true,
        // },
      ],
    };
  },
  methods: {
    addNewTwist() {
      let newTwist = {
        content: this.newTwistContent,
        date: Date.now(),
        liked: false,
      };
      // this.twists.unshift(newTwist);
      // Add a new document with a generated id.
      db.collection("Twists") //Twist with capital T since its the written like that in Firebase
        .add(newTwist)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      this.newTwistContent = "";
    },
    deleteTwist(twist) {
      db.collection("Twists")
        .doc(twist.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    toggledLiked(twist) {
      db.collection("Twists").doc(twist.id).update({
          liked: !twist.liked,
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  mounted() {
    db.collection("Twists")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let twistChange = change.doc.data();
          twistChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New twist: ", twistChange);
            this.twists.unshift(twistChange);
          }
          if (change.type === "modified") {
            console.log("Modified twist: ", twistChange);
            let index = this.twists.findIndex(
              (twist) => twist.id === twistChange.id
            );
            Object.assign(this.twists[index], twistChange);
          }
          if (change.type === "removed") {
            console.log("Removed twist: ", twistChange);
            let index = this.twists.findIndex(
              (twist) => twist.id === twistChange.id
            );
            this.twists.splice(index, 1);
          }
        });
      });
  },
});
</script>

<style lang="sass">
.new-twist
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.twist-content
  white-space: pre-line

.twist-icons
  margin-left: -5px

.twist:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
</style>
