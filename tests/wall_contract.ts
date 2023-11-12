import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WallContract } from "../target/types/wall_contract";
import { assert } from "chai";

describe("wall_contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const keypair = anchor.web3.Keypair.generate();

  const program = anchor.workspace.WallContract as Program<WallContract>;

  it("Post created!", async () => {
    // Add your test here.
    const tx = await program.methods
      .createpost("Hello World", "Anonymongs", "#blokcchain")
      .accounts({
        signer: provider.publicKey,
        post: keypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log("Your transaction signature", tx);

    const posts = await program.account.post.all();

    assert.ok(
      posts.length > 0 &&
        posts[0].account.message === "Hello World" &&
        posts[0].account.author === "Anonymongs" &&
        posts[0].account.hashTag === "#blokcchain"
    );
  });

  it("Multiple posts created!", async () => {
    const postCount = 10; // Number of posts to create
    const postsData = Array.from({ length: postCount }, (_, i) => ({
      message: `Hello World ${i}`,
      author: `Anonymongs ${i}`,
      hashTag: `#blockchain${i}`,
    }));

    for (let postData of postsData) {
      const postKeypair = anchor.web3.Keypair.generate();
      const tx = await program.methods
        .createpost(postData.message, postData.author, postData.hashTag)
        .accounts({
          signer: provider.publicKey,
          post: postKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([postKeypair])
        .rpc();

      console.log("Your transaction signature", tx);
    }

    const posts = await program.account.post.all();
    // plus 1 because of the first post created in the previous test
    assert.ok(posts.length === postCount + 1);

    postsData.forEach((postData) => {
      assert.ok(
        posts.some(
          (post) =>
            post.account.message === postData.message &&
            post.account.author === postData.author &&
            post.account.hashTag === postData.hashTag
        )
      );
    });
  });
});
